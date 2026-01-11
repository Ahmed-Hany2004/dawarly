const { Resend } = require('resend');

const resend = new Resend(process.env.Resend_api_key);

async function sendOTP(email, otp) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: ${otp}</h2>`
  });
}





module.exports ={sendOTP}