const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
  }
});


function sendVerificationEmail(userEmail, userName, verificationCode) {
  const mailOptions = {
      from: process.env.GMAIL_USER,
      to: userEmail,
      subject: 'رمز التحقق من التسجيل',
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Verification</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        text-align: center;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        background-color: #241654;
                        color: #ffffff;
                        padding: 10px;
                        border-radius: 8px 8px 0 0;
                    }
                    .email-header img {
                        width: 90px;
                        height: auto;
                        margin-bottom: 10px;
                    }
                    .email-content {
                        padding: 20px;
                        text-align: center;
                    }
                    .email-content p {
                        font-size: 16px;
                        color: #333333;
                        margin-bottom: 20px;
                    }
                    .verification-code {
                        font-size: 24px;
                        font-weight: bold;
                        color: #500bf0;
                        margin-bottom: 20px;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #777777;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">
                        <img src="https://i.pinimg.com/736x/d4/b5/66/d4b5663e5cd8628dad5e7b927eeb62e0.jpg" alt="Company Logo">
                        <h1>Welcome to <span class="company-name" style="color: #ebebeb;">Oilfield Gate</span>!</h1>
                    </div>
                    <div class="email-content">
                        <p>Dear Mr. <strong class="user-name" style="color: #500bf0;">${userName}</strong>،</p>
                        <p>Your verification code is:</p>
                        <div class="verification-code">${verificationCode}</div>
                    </div>
                    <div class="footer">
                        <p>Thank you for joining us!</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    
      text: ` ${userName}، شكرًا لتسجيلك في موقعنا! رمز التحقق الخاص بك هو: ${verificationCode}مرحبًا`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log('Error sending email:', error);
      } else {
          console.log('Email sent:', info.response);
      }
  });
}


module.exports = {sendVerificationEmail}