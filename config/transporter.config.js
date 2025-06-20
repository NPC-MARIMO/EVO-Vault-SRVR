const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASS,
  },
});
