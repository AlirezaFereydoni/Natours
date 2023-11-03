const nodemailer = require('nodemailer');

const emailSender = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Alireza Fereydoni <AlirezaFereydoni@dev.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(transporter);

  return await transporter.sendMail(mailOptions);
};

module.exports = emailSender;
