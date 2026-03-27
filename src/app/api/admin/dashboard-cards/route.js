import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnection";
export async function GET() {
  try {
    const [
      salons,
      users,
      appointments,
      pending,
      completed,
      revenue,
      avgRating
    ] = await Promise.all([

      // Total Salons
      query(`SELECT COUNT(*) AS totalSalons FROM salons WHERE active = true`),

      // Total Customers
      query(`SELECT COUNT(*) AS totalCustomers FROM users WHERE active = true`),

      // Total Appointments
      query(`SELECT COUNT(*) AS totalAppointments FROM appointment`),

      // Pending Appointments
      query(`
        SELECT COUNT(*) AS pendingAppointments 
        FROM appointment 
        WHERE appointment_status = 'pending'
      `),

      // Completed Appointments
      query(`
        SELECT COUNT(*) AS completedAppointments 
        FROM appointment 
        WHERE appointment_status = 'completed'
      `),

      // Revenue
      query(`
        SELECT IFNULL(SUM(ss.price), 0) AS revenue
        FROM appointment a
        JOIN salon_services ss ON a.services_id = ss.id
        WHERE a.appointment_status = 'completed'
      `),

      // Average Rating (optional)
      query(`
        SELECT IFNULL(AVG(rating), 0) AS averageRating 
        FROM reviews
      `).catch(() => [{ averageRating: 0 }])
    ]);

    return NextResponse.json({
      totalSalons: salons[0].totalSalons,
      totalCustomers: users[0].totalCustomers,
      totalAppointments: appointments[0].totalAppointments,
      revenue: revenue[0].revenue,
      pendingAppointments: pending[0].pendingAppointments,
      completedAppointments: completed[0].completedAppointments,
      averageRating: avgRating[0]?.averageRating || 0,
    });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}