const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { getUrl } = require('../services/getUrl')

const { CLIENT_ID } = process.env;
const { CLIENT_SECRET } = process.env;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const { REFRESH_TOKEN } = process.env;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const createMail = async (type, username, id, email) => {
  const accessToken = await oAuth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "mosope.adeyemi.dev@gmail.com",
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  let message;

  switch (type) {
    case "verify_account":
      message = {
        from: "SurveyMunk 🚀 <mosope.adeyemi.dev@gmail.com>",
        to: email,
        subject: "Welcome to SurveyMunk",
        html: `
      <h3> Hi ${username},</h3>
      <hr>
      <h4 style="text-align: center; color: purple;">Welcome to SurveyMunk 🚀!</h4>
      <p> Thanks for joining us, we are really excited to have you with us. We believe you will enjoy your time with us.</p>
      <p>But first we would need you to verify your email address, this would help us keep SurveyMunk bot free 🤖 and your acount safe. </p>
      <p>Kindly <a style="decoration: none; color: purple;" href="${getUrl()}user/verify-email/${id}">Click Here</a> to verify your account <b>${id}</b></p>
      <hr>
      <small style="color: silver; font-size: 14px; text-align: center;">&copy; Leventis Digital</small>
      `,
        text: `Hi ${username}, Thanks for signin up, we are really excited to have you with us 🚀*`,
      };
      break;
    case "forgot_password":
      message = {
        from: "SurveyMunk 🚀 <mosope.adeyemi.dev@gmail.com>",
        to: email,
        subject: "Reset Password",
        html: `
        <h3> Hi, ${username}</h3>
        <hr>
        <h4 style="text-align: center; color: purple;">Forgot Password ? no worries, it happens to the best of us 😉.</h4>
        <p> Please <a style="decoration: none; color: purple;" href="${getUrl()}user/reset-password/${id}">Click Here</a> to complete your password reset process</p>
        <hr>
        <small style="color: silver; font-size: 14px; text-align: center;">&copy; Leventis Digital</small>
        `,
        text: `Hi ${username}, Here's a link to reset your account password`,
      };
      break;
  }
  try {
    const info = await transporter.sendMail(message);
    console.log(info);
    return "success";
  } catch (error) {
    console.log(error);
    return "failed";
  }
};
module.exports = createMail;
