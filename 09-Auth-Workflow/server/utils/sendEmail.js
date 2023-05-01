const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  let transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Scythe 👻" <scythe@example.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
