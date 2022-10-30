/*
 * Title : Sample handlers
 * Description : Sample handlers
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 *
 */

// dependencies

// module scaffolding
const handlers = {};

// handlers
handlers.sampleHandlers = (requestProperties, callback) => {
  //   console.log("requestProperties", requestProperties);
  console.log("requestProperties", requestProperties);
  callback(200, {
    message: "This is sample handler",
  });
};
module.exports = handlers;
