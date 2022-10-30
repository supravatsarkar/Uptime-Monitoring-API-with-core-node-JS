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

// routes
const routes = {
  sample: sampleHandlers,
  user: userHandlers,
};

module.exports = routes;
