import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// Utility: make sure the appointment exists and is owned by the current user
async function getOwnedAppointment(id, userId) {
  const rows = await query(
    `SELECT * FROM appointment WHERE id = ? AND user_id = ? LIMIT 1`,
    [id, userId]
  );
  return rows[0] || null;
}

// ----------------------- GET (Single Appointment) -----------------------
export const GET = withUserAuth(async (req) => {
    const { searchParams } = new URL(req.url);
     const  id = parseInt(searchParams.get('id'))
  const userId = req.user.id;


  try {
    const rows = await query(
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
        s.salon_name,
        s.city,
        s.country,
        srv.title AS service_name,
        srv.price AS service_price,
        srv.discount,
        srv.duration_minutes
      FROM appointment a
      JOIN salons s ON a.salon_id = s.id
      JOIN salon_services srv ON a.services_id = srv.id
      WHERE a.id = ? AND a.user_id = ?
      LIMIT 1
      `,
      [id, userId]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointment" },
      { status: 500 }
    );
  }
});

// ----------------------- PUT (Reschedule: date/time) -----------------------
export const PUT = withUserAuth(async (req) => {
  const userId = await req.user.id;
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));
  const body = await req.json();
  const { date, time } = body;

  if (!date || !time) {
    return NextResponse.json(
      {
        success: false,
        message: "appointment_date and appointment_time are required",
      },
      { status: 400 }
    );
  }

  try {
    const appt = await getOwnedAppointment(id, userId);
    if (!appt) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Only allow reschedule if status is pending
    if (appt.appointment_status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Only pending appointments can be rescheduled" },
        { status: 400 }
      );
    }

    // ✅ Validation: Prevent past date/time
    const now = new Date();
    const selectedDateTime = new Date(`${date}T${time}`);

    if (selectedDateTime < now) {
      return NextResponse.json(
        { success: false, message: "Cannot reschedule to a past date/time" },
        { status: 400 }
      );
    }

    // Prevent double booking for the same salon/date/time
    const conflict = await query(
      `
      SELECT id FROM appointment
      WHERE salon_id = ? 
        AND appointment_date = ? 
        AND appointment_time = ?
        AND id <> ?
      LIMIT 1
      `,
      [appt.salon_id, date, time, id]
    );
    if (conflict.length > 0) {
      return NextResponse.json(
        { success: false, message: "This time slot is already booked for this salon." },
        { status: 409 }
      );
    }

    await query(
      `
      UPDATE appointment
      SET appointment_date = ?, appointment_time = ?
      WHERE id = ? AND user_id = ?
      `,
      [date, time, id, userId]
    );

    return NextResponse.json({
      success: true,
      message: "Appointment rescheduled",
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reschedule appointment" },
      { status: 500 }
    );
  }
});


// ----------------------- PATCH (Optional: status / accept) -----------------------
export const PATCH = withUserAuth(async (req, { params }) => {
  const userId = req.user.id;
  const { id } = params;
  const body = await req.json();
  const { status, accept } = body;

  const allowedStatuses = ["pending", "completed", "rejected", "confirmed"];

  if (status && !allowedStatuses.includes(status)) {
    return NextResponse.json(
      { success: false, message: "Invalid status value" },
      { status: 400 }
    );
  }

  try {
    const appt = await getOwnedAppointment(id, userId);
    if (!appt) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    const fields = [];
    const values = [];

    if (typeof accept === "boolean") {
      fields.push("accept = ?");
      values.push(accept);
    }
    if (status) {
      fields.push("appointment_status = ?");
      values.push(status);
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, message: "Nothing to update" },
        { status: 400 }
      );
    }

    values.push(id, userId);

    await query(
      `UPDATE appointment SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
      values
    );

    return NextResponse.json({ success: true, message: "Appointment updated" });
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 }
    );
  }
});

// ----------------------- DELETE (Cancel / Remove) -----------------------
export const DELETE = withUserAuth(async (req) => {
  const userId = req.user.id;
    const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id"));

  try {
    const appt = await getOwnedAppointment(id, userId);
    if (!appt) {
      return NextResponse.json(
        { success: false, message: "Appointment not found" },
        { status: 404 }
      );
    }

    // Allow deletion/cancellation only when pending or confirmed
    if (!["pending", "confirmed"].includes(appt.appointment_status)) {
      return NextResponse.json(
        { success: false, message: "Only pending or confirmed appointments can be cancelled" },
        { status: 400 }
      );
    }

    await query(`DELETE FROM appointment WHERE id = ? AND user_id = ?`, [id, userId]);

    return NextResponse.json({ success: true, message: "Appointment deleted" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete appointment" },
      { status: 500 }
    );
  }
});
