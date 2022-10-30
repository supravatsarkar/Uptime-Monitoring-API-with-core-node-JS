/*
 * Title : User handlers
 * Description : User handlers
 * Author : Supravat Sarkar
 * Date : 29/10/2022
 *
 */

// dependencies
const data = require("../lib/data");
const { hash, jsonParse } = require("../helper/utilities");

// module scaffolding
const handlers = {};

// handlers
handlers.userHandlers = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._user = {};
// Register user
handlers._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
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
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  console.log("userObj =>", {
    firstName,
    lastName,
    phone,
    password: hash(password),
    tosAgreement,
  });
  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err, user) => {
      if (err) {
        const userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        data.create("users", phone, userObj, (err2, user) => {
          if (!err2) {
            callback(200, {
              message: "User was created successfully.",
            });
          } else {
            callback(500, {
              error: "Could not created user.",
            });
          }
        });
      } else {
        callback(500, {
          error: "User already exist or server error.",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was an error in your request body",
    });
  }
};

// get user
handlers._user.get = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 10
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // checking phone number
    data.read("users", phone, (err, userJson) => {
      if (!err && userJson) {
        const user = jsonParse(userJson);
        delete user.password;
        callback(200, user);
      } else {
        callback(500, {
          error: "User not exist or an error in server",
        });
      }
    });
  } else {
    callback(400, {
      error:
        "There was an error in your request query  (Invalid phone number).",
    });
  }
};
//Update User
handlers._user.put = (requestProperties, callback) => {
  // check validation
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 10
      ? requestProperties.body.phone
      : false;
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 4
      ? requestProperties.body.password
      : false;

  // find user
  if (phone) {
    data.read("users", phone, (err, userJson) => {
      if (!err && userJson) {
        // update user
        const user = jsonParse(userJson);
        if (firstName || lastName || password) {
          firstName ? (user.firstName = firstName) : 0;
          lastName ? (user.lastName = lastName) : 0;
          password ? (user.password = hash(password)) : 0;
          data.update("users", phone, user, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User updated successfully",
              });
            } else {
              callback(500, {
                error: "There was an error in server.",
              });
            }
          });
        } else {
          callback(400, {
            error:
              "There was an error in phone number in your request. (Update value)",
          });
        }
      } else {
        callback(500, {
          error: "User not exist or an error in server",
        });
      }
    });
  } else {
    callback(400, {
      error:
        "There was an error in phone number in your request. (Invalid phone number)",
    });
  }
};

//Delete User
handlers._user.delete = (requestProperties, callback) => {
  // check validation
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 10
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // checking phone number
    data.read("users", phone, (err, userJson) => {
      if (!err && userJson) {
        data.delete("users", phone, (err) => {
          if (!err) {
            callback(200, {
              message: "User deleted successfully.",
            });
          } else {
            callback(500, {
              error: "There was an error in server.",
            });
          }
        });
      } else {
        callback(500, {
          error: "User not exist or an error in server",
        });
      }
    });
  } else {
    callback(400, {
      error:
        "There was an error in your request query  (Invalid phone number).",
    });
  }
};

module.exports = handlers;
