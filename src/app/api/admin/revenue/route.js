import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnection";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const months = parseInt(searchParams.get("months")) || 6;

    // Get last N months revenue + appointments
    const result = await query(`
      SELECT 
        DATE_FORMAT(a.appointment_date, '%b') AS month,
        MONTH(a.appointment_date) AS monthNumber,
        YEAR(a.appointment_date) AS year,
        COUNT(a.id) AS appointments,
        IFNULL(SUM(ss.price), 0) AS revenue
      FROM appointment a
      JOIN salon_services ss ON a.services_id = ss.id
      WHERE a.appointment_status = 'completed'
      AND a.appointment_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY year, monthNumber
      ORDER BY year, monthNumber ASC
    `, [months]);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("Revenue Chart Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}