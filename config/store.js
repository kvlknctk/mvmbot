const fs = require("fs");

function saveBearerToken(data) {
  fs.writeFile(
    "data/bearerTokenData.json",
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        console.error("Dosyaya yazılırken bir hata oluştu:", err);
        return;
      }
      console.log("Token bilgisi dosyaya başarıyla kaydedildi.");
    },
  );
}

function getBearerToken(callback) {
  fs.readFile("./data/bearerTokenData.json", "utf8", (err, data) => {
    if (err) {
      console.error("Dosya okunurken hata oluştu:", err);
      callback(err);
      return;
    }
    try {
      const tokenData = JSON.parse(data);
      callback(null, tokenData);
    } catch (err) {
      console.error("Dosya içeriği geçersiz JSON formatında:", err);
      callback(err);
    }
  });
}

module.exports = { saveBearerToken, getBearerToken };
