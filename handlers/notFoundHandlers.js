/*
 * Title : Not Found Handlers
 * Description : Not Found Handlers
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 */

// dependencies

// module scaffolding
const handlers = {};

// handlers methods
handlers.notFoundHandlers = (requestProperties, callback) => {
  console.log("Not Found Handlers");
  callback(400, {
    message: "Not found",
  });
};
module.exports = handlers;
