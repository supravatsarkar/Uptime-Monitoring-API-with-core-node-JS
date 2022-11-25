// dependencies
const https = require("https");
const queryString = require("querystring");
const { twilioCreds } = require("./environment");
// module scaffolding
const notification = {};

notification.sendTwilioSms = (phoneNumber, messageBody, callback) => {
  // validation check
  const phone =
    typeof phoneNumber === "string" && phoneNumber.trim().length === 10
      ? phoneNumber
      : false;
  const msgBody =
    typeof messageBody === "string" &&
    messageBody.trim().length <= 1600 &&
    messageBody.trim().length > 0
      ? messageBody
      : false;
  if (phone && msgBody) {
    const options = {
      host: "api.twilio.com",
      path: `/2010-04-01/Accounts/${twilioCreds.TWILIO_ACCOUNT_SID}/Messages.json`,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      auth: `${twilioCreds.TWILIO_ACCOUNT_SID}:${twilioCreds.AUTH_TOKEN}`,
    };
    console.log("options=>", options);
    const payload = {
      Body: msgBody,
      From: twilioCreds.From,
      To: `+91${phone}`,
    };
    console.log("options=>", payload);
    // req send
    const req = https.request(options, (res) => {
      console.log("res.status=>", res.statusCode);
      console.log("res.status=>", res.statusMessage);
      if (res.statusCode == 200 || res.statusCode == 201) {
        callback(null);
      } else {
        callback(
          `Error getting from Twilio:=> statusCode: ${res.statusCode}, statusCode: ${res.statusMessage}`
        );
      }
    });
    req.on("error", (err) => {
      console.log(err);
      callback(`Error getting from on our request:=> ${err}`);
    });
    const payloadQueryString = queryString.stringify(payload);
    // console.log(payloadQueryString);
    req.write(payloadQueryString);
    req.end();
  } else {
    callback("Invalid phone number or message body");
  }
};

// export
module.exports = notification;
