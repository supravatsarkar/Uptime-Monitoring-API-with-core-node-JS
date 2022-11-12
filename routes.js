/*
 * Title : Routes
 * Description : Routes
 * Author : Supravat Sarkar
 * Date : 25/09/2022
 *
 */

// dependencies
const { sampleHandlers } = require("./handlers/sampleHandlers");
const { userHandlers } = require("./handlers/userHandlers");
const { tokenHandlers } = require("./handlers/tokenHandlers");
const { checkHandlers } = require("./handlers/checkHandlers");

// routes
const routes = {
  sample: sampleHandlers,
  user: userHandlers,
  token: tokenHandlers,
  check: checkHandlers,
};

module.exports = routes;
