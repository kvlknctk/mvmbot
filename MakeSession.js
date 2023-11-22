/**
 * Node.js tabanlı kullanıcı giriş ve doğrulama scripti.
 * Bu script, kullanıcıdan TC kimlik numarası ve şifresini alarak,
 * bir giriş işlemi gerçekleştirir. Kullanıcının kimlik doğrulaması için,
 * SMS kodu ile ikinci bir adım gereklidir.
 *
 * @module MakeSession
 */

const axios = require("axios");
const { encrypt } = require("./utils/crypto");
const readline = require("readline");
const { saveBearerToken } = require("./config/store");
const config = require("./config/config");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Kullanıcıdan TC kimlik numarası ve şifre alınır.
let username = "";
let password = "";
let smsCode = "";
let hashToken = "";

rl.question("TC No Giriniz: ", async (inputTcNo) => {
  username = encrypt(inputTcNo, config.apiCode);
  console.log(`Username hash [${username}]`);

  rl.question("Şifrenizi Giriniz: ", async (inputPassword) => {
    password = encrypt(inputPassword, config.apiCode);
    console.log(`Password hash [${password}]`);

    loginUser(username, password)
      .then(async (response) => {
        console.log("loginUser Response: ", response);
        hashToken = encrypt(response.content.token, config.apiCode);
        console.log(`Receive token [${response.content.token}]`);
        console.log(`Token hash [${password}]`);
        rl.question(
          "Telefonunuza gönderilen SMS kodunu giriniz: ",
          async (inputSmsCode) => {
            smsCode = encrypt(inputSmsCode, config.apiCode);
            console.log(`SMS Code hash [${smsCode}]`);

            loginUserControl(hashToken, smsCode)
              .then((response) => {
                // Burada dönen hash değeri diğer istekler için kullanılacaktır.
                saveBearerToken(response.content);
                console.log("Token Kaydedildi", response.content);
              })
              .catch((error) => {
                console.error("LoginUserControl e:", error);
              });

            rl.close();
          },
        );
      })
      .catch((error) => {
        console.error("Login Error:", error);
      });
  });
});

async function loginUser(username, password) {
  try {
    const response = await axios.post(
      `${config.hostName}/api/LoginUser`,
      {
        Username: username,
        Password: password,
      },
      {
        headers: { APIKEY: config.apiKey },
      },
    );

    return response.data;
  } catch (error) {
    console.error("LoginUser error:", error);
    throw error;
  }
}

async function loginUserControl(token, smsCode) {
  try {
    const response = await axios.post(
      `${config.hostName}/api/LoginUserControl`,
      {
        token: token,
        Password: smsCode,
      },
      {
        headers: { APIKEY: config.apiKey },
      },
    );

    return response.data;
  } catch (error) {
    console.error("LoginUserControl error:", error);
    throw error;
  }
}
