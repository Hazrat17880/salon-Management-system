import { withSalonAuth } from "@/lib/authSalon"; // similar to withUserAuth, but for salon
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

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
    // Ensure appointment belongs to the salon
    const appt = await query(
      `SELECT id FROM appointment WHERE id = ? AND salon_id = ? LIMIT 1`,
      [appointment_id, salonId]
    );
    if (appt.length === 0) {
      return NextResponse.json(
        { success: false, message: "Appointment not found or does not belong to this salon." },
        { status: 404 }
      );
    }

    await query(
      `
      UPDATE appointment 
      SET appointment_status = ?, accept = ? , user_view = ?
      WHERE id = ? AND salon_id = ?
      `,
      [status, accept ?? false, false, appointment_id, salonId]
    );

    return NextResponse.json({ success: true, message: "Appointment updated successfully!" });
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
