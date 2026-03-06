// lib/appointmentEmail.js
import nodemailer from "nodemailer";

export async function sendAppointmentEmail({
  toEmail,
  customerName,
  salonName,
  serviceName,
  appointmentDate,
  appointmentTime,
  amount,
  status,
  appointmentId,
  rejectionReason = null
}) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    let subject = "";
    let htmlContent = "";

    // Format date nicely
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    

    const mailOptions = {
      from: `"Salon Booking System" <${process.env.USER_EMAIL}>`,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Appointment ${status} email sent: `, info.response);
    return true;
  } catch (error) {
    console.error(`❌ Error sending appointment ${status} email:`, error);
    return false;
  }
}