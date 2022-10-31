/*
 * Title : User handlers
 * Description : User handlers
 * Author : Supravat Sarkar
 * Date : 29/10/2022
 *
 */

// dependencies
const data = require("../lib/data");
const { hash, jsonParse, createRandomString } = require("../helper/utilities");

// module scaffolding
const handlers = {};

// handlers
handlers.tokenHandlers = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._token = {};
// create user
handlers._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 10
      ? requestProperties.body.phone
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 4
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userJsonStr) => {
      if (!err && userJsonStr) {
        const userObj = jsonParse(userJsonStr);
        if (userObj.password === hash(password)) {
          const tokenId = createRandomString(20);
          const tokenObj = {
            phone,
            tokenId,
            expires: Date.now() + 60 * 60 * 1000,
          };
          data.create("tokens", tokenId, tokenObj, (err2) => {
            if (!err2) {
              callback(200, tokenObj);
            } else {
              callback(500, {
                error: "There was an error in the server.",
              });
            }
          });
        } else {
          callback(400, {
            error: "Password incorrect",
          });
        }
      } else {
        callback(400, {
          error: "Phone number not exist.",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was an error in your request body(Invalid phone/password).",
    });
  }
};

// get token
handlers._token.get = (requestProperties, callback) => {};
//Update token
handlers._token.put = (requestProperties, callback) => {
  // check validation
};

//Delete token
handlers._token.delete = (requestProperties, callback) => {
  // check validation
};

module.exports = handlers;
