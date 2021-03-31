const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// env vars
const gmailEmail = "ruairidhgallaghers3@gmail.com";
const gmailPassword = "password"

// create node mailer transport
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

async function sendWelcomeEmail(email) {
  const mailOptions = {
    from: 'Ruairidh Gmail <ruairidhgallaghers3@gmail.com>',
    to: email,
    subject: 'Welcome to The Grid!',
    text: `Hey ${email}! Welcome to The Grid, the elite team of secret agents.`,
  };

  try{
    await mailTransport.sendMail(mailOptions);
  } catch(e){
    functions.logger.log("some error", e);

  }


  console.log('New welcome email sent to:', email);

  return null;
}

exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  const email = user.email;
  return sendWelcomeEmail(email);
});
