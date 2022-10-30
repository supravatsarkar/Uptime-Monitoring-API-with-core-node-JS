const crypto = require("crypto");

const secret = "abcdefg";
const hash = crypto
  .createHmac("sha256", secret)
  .update("Welcome to JavaTpoint")
  .digest("hex");
console.log(hash);

const hash2 = crypto
  .createHash("sha256")
  .update("Man oh man do I love node!" + "pap")
  .digest("base64");

const hash3 = crypto
  .createHash("sha256")
  .update("Man oh man do I love node!" + "pap")
  .digest("hex");

console.log("hash2 (base64) : ", hash2);
console.log("hash3 (hex) : ", hash3);
