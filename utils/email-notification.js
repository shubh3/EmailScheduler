const nodemailer = require("nodemailer");

const mailHelper = async (option) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  console.log(process.env.SMTP_HOST);
  let message = {
    from: "interview@bigapp.com", // sender address
    to: option.email, // list of receivers
    subject: option.subject, // Subject line
    text: option.content, // plain text body
  };
  console.log(message);
  
  await transporter.sendMail(message);
};

module.exports = mailHelper;
