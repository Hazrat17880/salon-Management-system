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
import { v2 as cloudinary } from "cloudinary";



// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


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

  try {
    // ✅ Extract form-data instead of JSON because we are handling file upload
    const formData = await req.formData();
    const salon_id = formData.get("salon_id");
    const service_id = formData.get("service_id");
    const date = formData.get("date");
    const time = formData.get("time");
    const imageFile = formData.get("image"); // expecting <input type="file" name="image" />

    if (!salon_id || !service_id || !date || !time) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure the service belongs to the salon
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

    // Prevent double booking
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

    let imageUrl = null;
    if (imageFile && imageFile.name) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // ✅ Upload to Cloudinary
      const uploadRes = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "appointments" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      imageUrl = uploadRes.secure_url;
    }

    // ✅ Insert appointment with image URL and GET THE INSERTED ID
    const result = await query(
      `
      INSERT INTO appointment 
        (salon_id, user_id, services_id, appointment_date, appointment_time, appointment_status, accept, user_view, image)
      VALUES 
        (?, ?, ?, ?, ?, 'pending', false, ?, ?)
      `,
      [salon_id, userId, service_id, date, time, true, imageUrl]
    );

    // Get the inserted appointment ID (depends on your database library)
    // For MySQL with mysql2, result.insertId gives you the auto-generated ID
    const appointmentId = result.insertId;

    return NextResponse.json({
      success: true,
      message: "Appointment booked successfully!",
      appointmentId: appointmentId, // ✅ Return the ID
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create appointment" },
      { status: 500 }
    );
  }
});