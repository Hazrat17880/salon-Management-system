import nodemailer from "nodemailer";

export async function sendOTPEmail(toEmail, fullname, otp,subject) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or your email service
      auth: {
        user: process.env.USER_EMAIL, // set in .env
        pass: process.env.USER_PASSWORD, // Gmail App Password if 2FA enabled
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: toEmail,
      subject: subject,
      html: `
        <h3>Hello ${fullname},</h3>
          <p>Thank you for using YongSMS. Your OTP is: 
           <span style="color: green; font-weight: bold; font-size: 20px;">
             ${otp}
           </span>
        </p>
        <p>Please use this OTP to verify your account.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return false;
  }
}
