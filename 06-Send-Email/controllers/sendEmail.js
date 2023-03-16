const nodemailer = require("nodemailer");

// Ethereal
const sendEmail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "stewart90@ethereal.email",
      pass: "MGZymMeRTR8wAbhbee",
    },
  });

  let info = await transporter.sendMail({
    from: '"nodejs tutorial" <nodejs@example.com>',
    to: "bar@example.com",
    subject: "Testing email sending from NodeJS",
    html: "<h1><b>Lorem ipsum dolor sit amet, Dream on Abdullahi Fahm</b></h1>",
  });

  res.json(info);
};

// SendGrid
// Could not verify with sendgrid

module.exports = sendEmail;
