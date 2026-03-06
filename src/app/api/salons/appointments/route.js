import { withSalonAuth } from "@/lib/authSalon"; // similar to withUserAuth, but for salon
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

 async function sendOTPEmail(toEmail, fullname, otp,subject) {
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
          <p>Thank you for using YongSMS. 
           <span style="color: green; font-weight: bold; font-size: 20px;">
             ${otp}
           </span>
        </p>
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











// ----------------------- GET (Salon Appointments) -----------------------
export const GET = withSalonAuth(async (req) => {
  const salonId = await req.salon.id; // provided by your salon auth middleware

  try {
    const appointments = await query(
      `
      SELECT 
        a.id,
        a.salon_id,
        a.user_id,
        a.services_id,
        a.appointment_date,
        a.appointment_time,
        a.accept,
        a.appointment_status,
        u.full_name AS user_name,
        u.image,
        u.email AS user_email,
        u.phone_number AS user_phone,
        u.gender AS user_gender,
        u.date_of_birth AS user_dob,
        srv.title AS service_name,
        srv.price AS service_price,
        srv.discount,
        srv.duration_minutes
      FROM appointment a
      JOIN users u ON a.user_id = u.id
      JOIN salon_services srv ON a.services_id = srv.id
      WHERE a.salon_id = ?
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      `,
      [salonId]
    );
    await query(`
      UPDATE appointment 
SET salon_view = true
WHERE salon_view = false;
`)
    console.log(appointments, 'the data is');

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching salon appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
});

// ----------------------- PUT (Update Appointment Status) -----------------------
export const PUT = withSalonAuth(async (req) => {
  const salonId = req.salon.id;
  const body = await req.json();
  const { appointment_id, status, accept } = body;

  if (!appointment_id || !status) {
    return NextResponse.json(
      { success: false, message: "Appointment ID and status are required" },
      { status: 400 }
    );
  }

  try {
    // First, get appointment details with customer information
    // Using the correct column name 'salon_name' from your salons table
    const appointmentDetails = await query(
      `SELECT a.*, 
              u.full_name as customer_name, 
              u.email as customer_email,
              s.Title as service_name,
              sal.salon_name as salon_name
       FROM appointment a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN salon_services s ON a.services_id = s.id
       LEFT JOIN salons sal ON a.salon_id = sal.id
       WHERE a.id = ? AND a.salon_id = ? LIMIT 1`,
      [appointment_id, salonId]
    );

    if (appointmentDetails.length === 0) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to this salon." },
        { status: 404 }
      );
    }

    const appointment = appointmentDetails[0];
    console.log("Appointment details for email:", appointment); // Debug log

    // Update the appointment status
    await query(
      `
      UPDATE appointment 
      SET appointment_status = ?, accept = ? , user_view = ?
      WHERE id = ? AND salon_id = ?
      `,
      [status, accept ?? false, false, appointment_id, salonId]
    );

    // Send email notification based on status
    let emailSubject = "";
    let emailMessage = "";

    switch (status) {
      case "accept":
        emailSubject = "🎉 Your Appointment Has Been Confirmed!";
        emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4CAF50;">Appointment Confirmed!</h2>
            <p>Dear <strong>${appointment.customer_name}</strong>,</p>
            <p>Great news! Your appointment has been confirmed by <strong>${appointment.salon_name}</strong>.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${appointment.service_name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
              <p><strong>Amount:</strong> $${appointment.amount}</p>
            </div>
            
            <p>We look forward to serving you! Please arrive 5-10 minutes before your scheduled time.</p>
            <p>If you need to reschedule, please contact the salon directly.</p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #777; font-size: 12px;">This is an automated message from your salon booking system.</p>
          </div>
        `;
        break;

      case "reject":
        emailSubject = "😔 Appointment Update - Not Confirmed";
        emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f44336;">Appointment Update</h2>
            <p>Dear <strong>${appointment.customer_name}</strong>,</p>
            <p>We regret to inform you that your appointment at <strong>${appointment.salon_name}</strong> could not be confirmed at this time.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${appointment.service_name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
            </div>
            
            <p>Please contact the salon directly for more information or to reschedule your appointment.</p>
            <p>We apologize for any inconvenience caused.</p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #777; font-size: 12px;">This is an automated message from your salon booking system.</p>
          </div>
        `;
        break;

      case "completed":
        emailSubject = "✅ Your Appointment Has Been Completed";
        emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2196F3;">Appointment Completed</h2>
            <p>Dear <strong>${appointment.customer_name}</strong>,</p>
            <p>Thank you for visiting <strong>${appointment.salon_name}</strong>! We hope you enjoyed your service.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Service Details:</h3>
              <p><strong>Service:</strong> ${appointment.service_name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
            </div>
            
            <p>We'd love to hear about your experience! Please consider leaving a review.</p>
            <p>We look forward to seeing you again soon!</p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #777; font-size: 12px;">This is an automated message from your salon booking system.</p>
          </div>
        `;
        break;

      default:
        // For pending or other statuses
        emailSubject = "📅 Your Appointment Status Has Been Updated";
        emailMessage = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Appointment Update</h2>
            <p>Dear <strong>${appointment.customer_name}</strong>,</p>
            <p>Your appointment status at <strong>${appointment.salon_name}</strong> has been updated to: <strong>${status}</strong></p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Appointment Details:</h3>
              <p><strong>Service:</strong> ${appointment.service_name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointment_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointment_time}</p>
            </div>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;" />
            <p style="color: #777; font-size: 12px;">This is an automated message from your salon booking system.</p>
          </div>
        `;
    }

    // Send the email
    if (appointment.customer_email) {
      console.log(`📧 Attempting to send email to ${appointment.customer_email}`);
      
      const emailSent = await sendOTPEmail(
        appointment.customer_email,
        appointment.customer_name,
        emailMessage,
        emailSubject
      );

      if (emailSent) {
        console.log(`✅ Email notification sent to ${appointment.customer_email} for appointment ${appointment_id}`);
      } else {
        console.error(`❌ Failed to send email notification to ${appointment.customer_email}`);
      }
    } else {
      console.log("⚠️ No customer email found for appointment:", appointment_id);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Appointment updated successfully!",
      emailSent: appointment.customer_email ? true : false 
    });

  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 }
    );
  }
});
// ----------------------- DELETE (Cancel Appointment) -----------------------
export const DELETE = withSalonAuth(async (req) => {
  const salonId = req.salon.id;
  const { searchParams } = new URL(req.url);
  const appointmentId = searchParams.get("id");

  if (!appointmentId) {
    return NextResponse.json(
      { success: false, message: "Appointment ID is required" },
      { status: 400 }
    );
  }

  try {
    const appt = await query(
      `SELECT id FROM appointment WHERE id = ? AND salon_id = ? LIMIT 1`,
      [appointmentId, salonId]
    );
    if (appt.length === 0) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to this salon." },
        { status: 404 }
      );
    }

    await query(
      `DELETE FROM appointment WHERE id = ? AND salon_id = ?`,
      [appointmentId, salonId]
    );

    return NextResponse.json({ success: true, message: "Appointment cancelled successfully!" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
});
