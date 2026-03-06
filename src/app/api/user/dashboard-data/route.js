// app/api/user/dashboard/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the numeric user ID from database using email
    const users = await query(
      `SELECT id FROM users WHERE email = ?`,
      [session.user.email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Fetch all appointments for this user with related data
    const appointments = await query(
      `SELECT 
          a.*,
          s.Title as service_name,
          s.price as service_price,
          sal.salon_name,
          sal.city,
          sal.image as salon_image,
          sal.street_info,
          COUNT(r.id) as review_count,
          AVG(r.stars) as avg_rating
       FROM appointment a
       LEFT JOIN salon_services s ON a.services_id = s.id
       LEFT JOIN salons sal ON a.salon_id = sal.id
       LEFT JOIN review r ON a.salon_id = r.salon_id AND r.user_id = a.user_id
       WHERE a.user_id = ?
       GROUP BY a.id
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [userId]
    );

    // Get additional stats
    const [stats] = await query(
      `SELECT 
          COUNT(*) as total_appointments,
          SUM(CASE WHEN a.appointment_status = 'completed' THEN 1 ELSE 0 END) as completed_count,
          SUM(CASE WHEN a.appointment_status IN ('accept', 'pending') OR a.appointment_status = '' THEN 1 ELSE 0 END) as upcoming_count,
          COALESCE(SUM(CASE WHEN a.payment_status = 'paid' THEN a.amount ELSE 0 END), 0) as total_spent,
          COUNT(DISTINCT a.salon_id) as unique_salons
       FROM appointment a
       WHERE a.user_id = ?`,
      [userId]
    );

    // FIXED: Get unread messages count by joining with conversations table
    let messagesCount = 0;
    let allMessages = [];
    
    try {
      // Get count of unread messages
      const [unreadResult] = await query(
        `SELECT COUNT(m.id) as unread_count 
         FROM messages m
         INNER JOIN conversations c ON m.conversation_id = c.id
         WHERE c.user_id = ? AND m.sender_type = 'salon' AND m.is_read = 0`,
        [userId]
      );
      messagesCount = unreadResult?.unread_count || 0;

      // Get all messages for this user (optional - if you want to display them)
      allMessages = await query(
        `SELECT 
            m.id,
            m.message,
            m.is_read,
            m.created_at,
            m.sender_type,
            c.id as conversation_id,
            s.salon_name,
            s.image as salon_image
         FROM messages m
         INNER JOIN conversations c ON m.conversation_id = c.id
         INNER JOIN salons s ON c.salon_id = s.id
         WHERE c.user_id = ?
         ORDER BY m.created_at DESC
         LIMIT 20`,
        [userId]
      );

    } catch (error) {
      console.log("Messages query error:", error.message);
      // Continue with messagesCount = 0
    }

    return NextResponse.json({
      success: true,
      data: {
        appointments: appointments,
        messages: allMessages, // Include all messages if needed
        stats: {
          upcoming: stats.upcoming_count || 0,
          completed: stats.completed_count || 0,
          salons: stats.unique_salons || 0,
          messages: messagesCount, // This is the unread count
          totalSpent: stats.total_spent || 0,
          totalAppointments: stats.total_appointments || 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}