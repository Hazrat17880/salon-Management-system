import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withAdminAuth } from '@/lib/authAdmin';

export const GET = withAdminAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salonId');
  const status = searchParams.get('status');
  const date = searchParams.get('date');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 20;
  const offset = (page - 1) * limit;

  try {
    let baseQuery = `
      SELECT 
        a.*,
        s.salon_name,
        s.email as salon_email,
        s.phone_number as salon_phone,
        u.full_name as user_name,
        u.email as user_email,
        u.phone_number as user_phone,
        sv.title as service_title,
        sv.price as service_price,
        sv.duration_minutes as service_duration
      FROM appointment a
      INNER JOIN salons s ON a.salon_id = s.id
      INNER JOIN users u ON a.user_id = u.id
      INNER JOIN salon_services sv ON a.services_id = sv.id
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM appointment a
      INNER JOIN salons s ON a.salon_id = s.id
      INNER JOIN users u ON a.user_id = u.id
      INNER JOIN salon_services sv ON a.services_id = sv.id
    `;

    const queryParams = [];
    const whereConditions = [];

    // Add filters if provided
    if (salonId) {
      whereConditions.push('a.salon_id = ?');
      queryParams.push(salonId);
    }

    if (status) {
      whereConditions.push('a.appointment_status = ?');
      queryParams.push(status);
    }

    if (date) {
      whereConditions.push('a.appointment_date = ?');
      queryParams.push(date);
    }

    // Add WHERE clause if there are conditions
    if (whereConditions.length > 0) {
      const whereClause = ' WHERE ' + whereConditions.join(' AND ');
      baseQuery += whereClause;
      countQuery += whereClause;
    }

    // Add ordering and pagination
    baseQuery += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
    baseQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    // Get appointments
    const appointments = await query(baseQuery, queryParams);

    // Get total count for pagination
    const [countResult] = await query(countQuery, queryParams.slice(0, -2)); // Remove limit/offset params
    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ 
      success: true, 
      data: {
        appointments,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error("GET appointments error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
});

// Endpoint to update appointment status
export const PUT = withAdminAuth(async (req) => {
  try {
    const { id, status } = await req.json();
    
    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Appointment ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'completed', 'rejected', 'accept'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Update the appointment status
    await query(
      `UPDATE appointment 
       SET appointment_status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [status, id]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Appointment status updated successfully" 
    });
  } catch (error) {
    console.error("UPDATE appointment error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 }
    );
  }
});