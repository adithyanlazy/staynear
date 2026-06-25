const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'StayNear - Email Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">StayNear</h1>
        </div>
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; text-align: center;">Email Verification</h2>
          <p style="color: #4b5563; text-align: center;">Your verification code is:</p>
          <div style="background: white; border: 2px dashed #667eea; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          <p style="color: #6b7280; text-align: center; font-size: 14px;">This code expires in 10 minutes.</p>
          <p style="color: #6b7280; text-align: center; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  const mailTransporter = getTransporter();

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error('Email send failed:', err.message);
    }
  }

  console.log(`\n📧 OTP for ${email}: ${otp}\n`);
  return false;
};

module.exports = { sendOTP };
