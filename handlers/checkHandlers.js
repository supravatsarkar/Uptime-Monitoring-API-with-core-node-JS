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
const { _token } = require("../handlers/tokenHandlers");
const environment = require("../helper/environment");
const { createRandomString } = require("../helper/utilities");

// module scaffolding
const handlers = {};

// handlers
handlers.checkHandlers = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handlers._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handlers._check = {};
// create check
handlers._check.post = (requestProperties, callback) => {
  //validation
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;
  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;
    if (token) {
      data.read("tokens", token, (err, tokenData) => {
        if (!err && tokenData) {
          let tokenObj = jsonParse(tokenData);
          let userPhone = tokenObj.phone;
          _token.verify(token, userPhone, (isValidToken) => {
            if (isValidToken) {
              data.read("users", userPhone, (err2, userData) => {
                if (!err2 && userData) {
                  const userObj = jsonParse(userData);
                  userObj.checks = userObj.checks ? userObj.checks : [];
                  if (userObj.checks.length < environment.maxChecks) {
                    const checkId = createRandomString(20);
                    const checkObj = {
                      checkId,
                      userPhone,
                      protocol,
                      method,
                      url,
                      successCodes,
                      timeoutSeconds,
                    };
                    data.create("checks", checkId, checkObj, (err3) => {
                      if (!err3) {
                        userObj.checks.push(checkId);
                        data.update("users", userPhone, userObj, (err5) => {
                          if (!err5) {
                            callback(200, checkObj);
                          } else {
                            callback(500, {
                              error:
                                "There was an error in Server side to user checks data update",
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          error:
                            "There was an error in Server side to checks data write",
                        });
                      }
                    });
                  } else {
                    callback(400, {
                      error: "User max checks limit over",
                    });
                  }
                } else {
                  callback(500, {
                    error:
                      "There was an error in server side to find user or user not exist.",
                  });
                }
              });
            } else {
              callback(403, {
                error:
                  "Authentication session expire or something wrong to verify token",
              });
            }
          });
        } else {
          callback(403, {
            error: "Authentication problem (Token not exist)",
          });
        }
      });
    } else {
      callback(403, {
        error: "Authentication problem (Check token in req header)",
      });
    }
  } else {
    callback(400, {
      error: "There was an error in your request body",
    });
  }
};

// get check
handlers._check.get = (requestProperties, callback) => {
  const checkId =
    typeof requestProperties.queryStringObject.checkId === "string" &&
    requestProperties.queryStringObject.checkId.trim().length === 20
      ? requestProperties.queryStringObject.checkId
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, checkDataStr) => {
      if (!err && checkDataStr) {
        const checkData = jsonParse(checkDataStr);
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        _token.verify(token, checkData.userPhone, (isValidToken) => {
          if (isValidToken) {
            callback(200, checkData);
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
      } else {
        callback(500, {
          error: "Check not exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was an error in your request body",
    });
  }
};
//Update check
handlers._check.put = (requestProperties, callback) => {
  const checkId =
    typeof requestProperties.body.checkId === "string" &&
    requestProperties.body.checkId.trim().length === 20
      ? requestProperties.body.checkId
      : false;
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;
  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  const token =
    typeof requestProperties.headersObject.token === "string"
      ? requestProperties.headersObject.token
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, checkDataStr) => {
      if (!err && checkDataStr) {
        const checkData = jsonParse(checkDataStr);
        if (protocol || url || method || successCodes || timeoutSeconds) {
          _token.verify(token, checkData.userPhone, (isValidToken) => {
            if (isValidToken) {
              if (protocol) {
                checkData.protocol = protocol;
              }
              if (url) {
                checkData.url = url;
              }
              if (method) {
                checkData.method = method;
              }
              if (successCodes) {
                checkData.successCodes = successCodes;
              }
              if (protocol) {
                checkData.timeoutSeconds = timeoutSeconds;
              }
              data.update("checks", checkData.checkId, checkData, (err) => {
                if (!err) {
                  callback(200, checkData);
                } else {
                  callback(500, {
                    error: "There was an error in server side",
                  });
                }
              });
            } else {
              callback(403, {
                error: "Authentication failure",
              });
            }
          });
        } else {
          callback(400, {
            error: "At least one key need for update ",
          });
        }
      } else {
        callback(500, {
          error: "Check not exist or server side error",
        });
      }
    });
  } else {
    callback(400, {
      error: "Please enter valid checkId with 20 char",
    });
  }
};

//Delete check
handlers._check.delete = (requestProperties, callback) => {
  const checkId =
    typeof requestProperties.queryStringObject.checkId === "string" &&
    requestProperties.queryStringObject.checkId.trim().length === 20
      ? requestProperties.queryStringObject.checkId
      : false;

  if (checkId) {
    data.read("checks", checkId, (err, checkDataStr) => {
      if (!err && checkDataStr) {
        const checkData = jsonParse(checkDataStr);
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;
        _token.verify(token, checkData.userPhone, (isValidToken) => {
          if (isValidToken) {
            data.delete("checks", checkId, (err2) => {
              if (!err2) {
                data.read("users", checkData.userPhone, (err3, userDataStr) => {
                  if (!err3 && userDataStr) {
                    const userObj = jsonParse(userDataStr);
                    const userChecks =
                      typeof userObj.checks === "object" &&
                      userObj.checks instanceof Array
                        ? userObj.checks
                        : [];
                    console.log("userChecks=>", userChecks);
                    const checkPosition = userChecks.indexOf(checkId);
                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);
                      userObj.checks = userChecks;
                      console.log("userObj.checks=>", userObj.checks);
                      data.update(
                        "users",
                        checkData.userPhone,
                        userObj,
                        (err4) => {
                          if (!err4) {
                            callback(200, {
                              message: "Check delete successful",
                            });
                          } else {
                            callback(500, {
                              error: "There was an error in server side",
                            });
                          }
                        }
                      );
                    } else {
                      callback(500, {
                        error:
                          "The check id which you try to delete is not exist in user check list",
                      });
                    }
                  } else {
                    callback(500, {
                      error:
                        "User not found Or There was an error in server side to",
                    });
                  }
                });
              } else {
                callback(500, {
                  error: "There was an error in server side",
                });
              }
            });
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
      } else {
        callback(500, {
          error: "Check not exist",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was an error in your request body",
    });
  }
};

module.exports = handlers;
