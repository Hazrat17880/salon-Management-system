import { withSalonAuth } from "@/lib/authSalon";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (Salon Dashboard Analytics) -----------------------
export const GET = withSalonAuth(async (req) => {
  const salonId = req.salon.id;

  try {
    // 1. Get Salon Services
    const services = await query(
      `SELECT id, main_category, sub_category, title, price, status 
       FROM salon_services 
       WHERE salon_id = ? 
       ORDER BY created_at DESC`,
      [salonId]
    );

    // 2. Get Appointments by Status
    const appointments = await query(
      `SELECT 
        appointment_status, 
        COUNT(*) as count 
       FROM appointment 
       WHERE salon_id = ? 
       GROUP BY appointment_status`,
      [salonId]
    );

    // 3. Get One Year Revenue by Month (Completed Appointments Only)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const revenueByMonth = await query(
      `SELECT 
        YEAR(a.appointment_date) as year,
        MONTH(a.appointment_date) as month,
        SUM(ss.price) as revenue,
        COUNT(a.id) as completed_appointments
       FROM appointment a
       INNER JOIN salon_services ss ON a.services_id = ss.id
       WHERE a.salon_id = ? 
         AND a.appointment_status = 'completed'
         AND a.appointment_date >= ?
       GROUP BY YEAR(a.appointment_date), MONTH(a.appointment_date)
       ORDER BY year, month`,
      [salonId, oneYearAgo.toISOString().split('T')[0]]
    );

    // 4. Get Weekly Bookings for the Last Month
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const weeklyBookings = await query(
      `SELECT 
        YEARWEEK(a.appointment_date, 1) as week_number,
        COUNT(a.id) as booking_count
       FROM appointment a
       WHERE a.salon_id = ? 
         AND a.appointment_date >= ?
       GROUP BY YEARWEEK(a.appointment_date, 1)
       ORDER BY week_number
       LIMIT 4`,
      [salonId, oneMonthAgo.toISOString().split('T')[0]]
    );

    // 5. Get Services Revenue (Completed Appointments Only)
    const servicesRevenue = await query(
      `SELECT 
        ss.id as service_id,
        ss.title as service_name,
        ss.main_category,
        ss.sub_category,
        COUNT(a.id) as completed_count,
        SUM(ss.price) as total_revenue
       FROM salon_services ss
       LEFT JOIN appointment a ON ss.id = a.services_id 
         AND a.appointment_status = 'completed'
         AND a.salon_id = ?
       WHERE ss.salon_id = ?
       GROUP BY ss.id, ss.title, ss.main_category, ss.sub_category
       ORDER BY total_revenue DESC`,
      [salonId, salonId]
    );

    // Format the response
    const responseData = {
      services,
      appointments: {
        completed: appointments.find(a => a.appointment_status === 'completed')?.count || 0,
        pending: appointments.find(a => a.appointment_status === 'pending')?.count || 0,
        accepted: appointments.find(a => a.appointment_status === 'accept')?.count || 0,
        rejected: appointments.find(a => a.appointment_status === 'rejected')?.count || 0
      },
      revenueByMonth: revenueByMonth.map(item => ({
        year: item.year,
        month: item.month,
        revenue: parseFloat(item.revenue) || 0,
        completedAppointments: item.completed_appointments
      })),
      weeklyBookings: weeklyBookings.map(item => ({
        week: item.week_number,
        bookings: item.booking_count
      })),
      servicesRevenue: servicesRevenue.map(item => ({
        serviceId: item.service_id,
        serviceName: item.service_name,
        mainCategory: item.main_category,
        subCategory: item.sub_category,
        completedCount: item.completed_count,
        totalRevenue: parseFloat(item.total_revenue) || 0
      }))
    };

    return NextResponse.json({ 
      success: true, 
      data: responseData 
    });

  } catch (error) {
    console.error("Salon dashboard analytics error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch salon analytics" },
      { status: 500 }
    );
  }
});