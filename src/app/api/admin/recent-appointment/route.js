// app/api/admin/appointments/recent/route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnection";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 5;

  const appointments = await query(`
  SELECT 
    a.id,
    a.appointment_date,
    a.appointment_time,
    a.appointment_status,
    
    s.salon_name,
    ss.title
  FROM appointment a
  JOIN users u ON a.user_id = u.id
  JOIN salons s ON a.salon_id = s.id
  JOIN salon_services ss ON a.services_id = ss.id
  ORDER BY a.id DESC
  LIMIT ?
`, [limit]);

    return NextResponse.json({ success: true, data: appointments });

  } catch (error) {
    console.error("Appointments API Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}