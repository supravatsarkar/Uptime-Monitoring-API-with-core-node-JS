/*
 * Title : Utilities methods
 * Description : Utilities methods
 * Author : Supravat Sarkar
 * Date : 29/10/2022
 */

// dependency
const crypto = require("crypto");
const environment = require("../helper/environment");

// module scaffolding
const utilities = {};

utilities.jsonParse = (json) => {
  let output;
  try {
    output = JSON.parse(json);
  } catch {
    output = {};
  }
  return output;
};

utilities.hash = (str) => {
  if (typeof str === "string") {
    let hashString = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");

    return hashString;
  } else {
    return null;
  }
};

utilities.createRandomString = (length) => {
  length = typeof length === "number" && length > 0 ? length : 20;
  const possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
  let randomStr = "";
  for (let i = 0; i < length; i++) {
    randomStr += possibleChar.charAt(
      Math.floor(Math.random() * possibleChar.length)
    );
  }
  console.log("Random String => ", randomStr);
  return randomStr;
};

module.exports = utilities;
