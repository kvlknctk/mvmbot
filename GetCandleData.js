const axios = require("axios");
const config = require("./config/config");
const { computeSha256Hash } = require("./utils/crypto");
const { getBearerToken } = require("./config/store");

getBearerToken((err, data) => {
  if (err) {
    console.error("Error", err);
    return;
  }

  async function makeRequest(symbol, period) {
    const postValues = { symbol: symbol, period: period };
    const ENDPOINT = "/api/GetCandleData";

    const checker = computeSha256Hash(ENDPOINT, postValues);

    try {
      let configAxios = {
        headers: {
          "Content-Type": "application/json",
          APIKEY: config.apiKey,
          Checker: checker,
          Authorization: data.hash,
        },
      };

      console.log("Request Headers", configAxios.headers);

      const response = await axios.post(
        config.hostName + ENDPOINT,
        postValues,
        configAxios,
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  makeRequest("GARAN", "1")
    .then((response) => {
      console.log("Response Data:", response);
    })
    .catch((error) => {
      console.error("Response Error:", {
        requestBearerToken: data.hash,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
      });
    });
});
