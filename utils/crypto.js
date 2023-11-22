const crypto = require("crypto");
const config = require("../config/config");

function encrypt(text, apiCode) {
  const iv = Buffer.alloc(16, 0);
  const key = Buffer.from(apiCode, "base64");
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

// Checker Parametresi Oluşturma
function computeSha256Hash(endPoint, body) {
  const stringedBody = JSON.stringify(body);
  const data = `${config.apiCode}${config.hostName}${endPoint}${stringedBody}`;
  let sha256 = crypto.createHash("sha256").update(data).digest("hex");

  console.log("Checker: ", {
    checkerDizesi: data,
    checkerDizesiSha256: sha256,
  });

  return sha256;
}

module.exports = { encrypt, computeSha256Hash };
