/*
 * Title : Req Res Handler
 * Description : Request and response handler
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 */

// dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const { notFoundHandlers } = require("../handlers/notFoundHandlers");
const { jsonParse } = require("../helper/utilities");
// module scaffolding
const handler = {};
handler.handleReqRes = (req, res) => {
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimPath = path.replace(/^\/+|\/+$/g, "");
  console.log("Hit path: ", trimPath);
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headersObject = req.headers;
  const requestProperties = {
    parseUrl,
    path,
    tripPath: trimPath,
    method,
    queryStringObject,
    headersObject,
  };

  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandlers = routes[trimPath] ? routes[trimPath] : notFoundHandlers;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", () => {
    realData += decoder.end();
    requestProperties.body = jsonParse(realData);
    chosenHandlers(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === "number" ? statusCode : 500;
      payload = typeof payload === "object" ? payload : {};
      const payloadString = JSON.stringify(payload);

      // return the final response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
    });
    // res.end(realData);
  });
};

module.exports = handler;
