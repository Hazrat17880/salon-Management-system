// import { withUserAuth } from "@/lib/authUser";
// import { query } from "@/lib/dbConnection";
// import { NextResponse } from "next/server";

// // ----------------------- GET -----------------------
// export const GET = withUserAuth(async (req) => {
//   const userId = req.user.id;
//   const { searchParams } = new URL(req.url);
//   const user_id = searchParams.get("user_id") || userId;

//   if (!user_id) {
//     return NextResponse.json(
//       { success: false, message: "User ID is required" },
//       { status: 400 }
//     );
//   }

//   try {
//     const appointments = await query(
//       `
//       SELECT a.id, a.appointment_date, a.appointment_time, a.accept,
//              s.salon_name, s.city, s.country, 
//              srv.name AS service_name, srv.price AS service_price
//       FROM appointment a
//       JOIN salons s ON a.salon_id = s.id
//       JOIN salon_services srv ON a.services_id = srv.id
//       WHERE a.user_id = ?
//       ORDER BY a.appointment_date ASC, a.appointment_time ASC
//       `,
//       [user_id]
//     );

//     return NextResponse.json({ success: true, data: appointments });
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to fetch appointments" },
//       { status: 500 }
//     );
//   }
// });

// // ----------------------- POST -----------------------
// export const POST = withUserAuth(async (req) => {
//   const userId =await req.user.id;
//   const body = await req.json();
//   const { salon_id, service_id, date, time } = body;
//   console.log(salon_id, service_id, date, time , body);

//   if (!salon_id || !service_id || !date || !time) {
//     return NextResponse.json(
//       { success: false, message: "All fields are required" },
//       { status: 400 }
//     );
//   }

//   try {
//     // Check if time slot already booked for the same salon
//     const existing = await query(
//       `
//       SELECT * FROM appointment
//       WHERE salon_id = ? AND appointment_date = ? AND appointment_time = ?
//       `,
//       [salon_id, date, time]
//     );

//     if (existing.length > 0) {
//       return NextResponse.json(
//         { success: false, message: "This time slot is already booked for this salon." },
//         { status: 400 }
//       );
//     }

//     // Insert new appointment
//     await query(
//       `
//       INSERT INTO appointment (salon_id, user_id, services_id, appointment_date, appointment_time)
//       VALUES (?, ?, ?, ?, ?)
//       `,
//       [salon_id, userId, service_id, date, time]
//     );

//     return NextResponse.json({ success: true, message: "Appointment booked successfully!" });
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to create appointment" },
//       { status: 500 }
//     );
//   }
// });

import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (User's Appointments) -----------------------
export const GET = withUserAuth(async (req) => {
  const userId = req.user.id;

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
      WHERE a.user_id = ?
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
      `,
      [userId]
    );

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
});

// ----------------------- POST (Create Appointment) -----------------------
export const POST = withUserAuth(async (req) => {
  const userId = req.user.id;
  const body = await req.json();
  const { salon_id, service_id, date, time } = body;

  if (!salon_id || !service_id || !date || !time) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    // Ensure the service belongs to the salon (basic integrity check)
    const svc = await query(
      `SELECT id FROM salon_services WHERE id = ? AND salon_id = ? LIMIT 1`,
      [service_id, salon_id]
    );
    if (svc.length === 0) {
      return NextResponse.json(
        { success: false, message: "Selected service does not belong to this salon." },
        { status: 400 }
      );
    }

    // Prevent double booking for the same salon/date/time
    const existing = await query(
      `
      SELECT id FROM appointment
      WHERE salon_id = ? AND appointment_date = ? AND appointment_time = ?
      LIMIT 1
      `,
      [salon_id, date, time]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: "This time slot is already booked for this salon." },
        { status: 409 }
      );
    }

    await query(
      `
      INSERT INTO appointment 
        (salon_id, user_id, services_id, appointment_date, appointment_time, appointment_status, accept, user_view)
      VALUES 
        (?, ?, ?, ?, ?, 'pending', false, ?)
      `,
      [salon_id, userId, service_id, date, time, true]
    );

    return NextResponse.json({ success: true, message: "Appointment booked successfully!" });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create appointment" },
      { status: 500 }
    );
  }
});
