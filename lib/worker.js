/*
 * Title : Worker file
 * Description : Background worker process here for user checks.
 * Author : Supravat Sarkar
 * Date : 30/11/2022
 */

// dependencies
const url = require("url");
const http = require("http");
const https = require("https");
const data = require("./data");
const { jsonParse } = require("./../helper/utilities");
const { sendTwilioSms } = require("./../helper/notification");
const environment = require("./../helper/environment");

// worker object - module scaffolding
const worker = {};

// look up all the checks from database
worker.gatherChecks = () => {
  // get all the checks
  data.list("checks", (err, checks) => {
    if (!err && checks.length > 0) {
      // iterate every check to further process
      checks.forEach((check) => {
        // get check details
        data.read("checks", check, (err2, originalCheckData) => {
          if (!err2 && originalCheckData) {
            // console.log(jsonParse(originalCheckData));
            // validation check
            worker.validate(jsonParse(originalCheckData));
          } else {
            console.log("Not find check details for this check=>", check);
          }
        });
      });
    } else {
      console.log("Not any checks to further process.");
    }
  });
};

//individual check validation
worker.validate = (originalCheckData) => {
  const checkDetails = originalCheckData;
  if (checkDetails && checkDetails.checkId) {
    checkDetails.state =
      typeof checkDetails.state === "string" &&
      ["up", "down"].indexOf(checkDetails.state) > -1
        ? checkDetails.state
        : "down";
    checkDetails.lastCheck =
      typeof checkDetails.lastCheck === "number" && checkDetails.lastCheck > 0
        ? checkDetails.lastCheck
        : false;
    // perform the check
    worker.performCheck(checkDetails);
  } else {
    console.log("Check validation Error: checkDetails is not properly saved");
  }
};

//perform  check
worker.performCheck = (checkDetails) => {
  // initial the check outcome
  let checkOutCum = {
    error: false,
    responseCode: false,
  };
  // is the outcome save into database
  let outComeSent = false;
  // parse the hostname & url from checkDetails
  const parseUrl = url.parse(
    `${checkDetails.protocol}://${checkDetails.url}`,
    true
  );
  const hostname = parseUrl.hostname;
  const { path } = parseUrl;
  // construct the request
  const requestDetails = {
    protocol: `${checkDetails.protocol}:`,
    hostname: hostname,
    method: checkDetails.method.toUpperCase(),
    path: path,
    timeout: checkDetails.timeoutSeconds * 1000,
  };
  const protocolToUse = checkDetails.protocol === "http" ? http : https;
  // request prepare
  const req = protocolToUse.request(requestDetails, (res) => {
    const status = res.statusCode;
    // update the check outcome
    checkOutCum.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutcome(checkDetails, checkOutCum);
      outComeSent = true;
    }
  });
  req.on("error", (e) => {
    // update the check outcome
    checkOutCum = {
      error: true,
      value: e,
    };
    if (!outComeSent) {
      worker.processCheckOutcome(checkDetails, checkOutCum);
      outComeSent = true;
    }
  });
  req.on("timeout", () => {
    // update the check outcome
    checkOutCum = {
      error: true,
      value: "timeout",
    };
    if (!outComeSent) {
      worker.processCheckOutcome(checkDetails, checkOutCum);
      outComeSent = true;
    }
  });

  // request send
  req.end();
};

// save & process the individual check outcome
worker.processCheckOutcome = (checkDetails, checkOutCum) => {
  // check if the outcome is up or down
  const state =
    !checkOutCum.error &&
    checkOutCum.responseCode &&
    checkDetails.successCodes.indexOf(checkOutCum.responseCode) > -1
      ? "up"
      : "down";

  //checking is state change and need alert to the user
  const alertWanted =
    checkDetails.lastCheck && checkDetails.state != state ? true : false;

  // update the check data into database
  const newCheckDetails = checkDetails;
  newCheckDetails.state = state;
  newCheckDetails.lastCheck = Date.now();
  console.log(
    `CheckId: ${checkDetails.checkId} =>Status code: ${checkOutCum.responseCode}, Response outcome Error message: ${checkOutCum.error}`
  );
  data.update("checks", checkDetails.checkId, newCheckDetails, (err) => {
    if (!err) {
      if (alertWanted) {
        worker.alertUserToStatusChange(newCheckDetails);
      } else {
        console.log("Not need to alert user : state not changed");
      }
    } else {
      console.log(
        "Error when update check details update after process outcome one of the checks"
      );
    }
  });
};

// alert the user when state changed one of the checks
worker.alertUserToStatusChange = (newCheckDetails) => {
  // prepare message for send to the user
  const msg = `Alert: Your check for ${newCheckDetails.method} ${newCheckDetails.protocol}://${newCheckDetails.url} is currently ${newCheckDetails.state}.`;
  // send message
  sendTwilioSms(newCheckDetails.userPhone, msg, (err) => {
    if (!err) {
      console.log(
        `Alert to the user phone ${newCheckDetails.userPhone}. Msg: ${msg}`
      );
    } else {
      console.log("Error when send alert one of the user:", err);
    }
  });
};

// loop for check every 1mint
worker.loop = () => {
  // gather all the checks
  const workerLoopTime =
    environment.workerLoopTime && typeof environment.workerLoopTime == "number"
      ? environment.workerLoopTime
      : 60;
  console.log("workerLoopTime in sec:", workerLoopTime);
  setInterval(() => {
    console.log(`Run check every ${workerLoopTime} sec.`);
    worker.gatherChecks();
  }, 1000 * workerLoopTime);
};

// worker initialization
worker.init = () => {
  // gather checks when first time run the server
  worker.gatherChecks();
  // call the loop continue check
  worker.loop();
};

// export
module.exports = worker;
