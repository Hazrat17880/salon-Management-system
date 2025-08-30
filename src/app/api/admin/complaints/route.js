import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withAdminAuth } from '@/lib/authAdmin';

export const GET = withAdminAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salonId');

  try {
    let salonsWithComplaints;

    if (salonId) {
      // Get specific salon with its complaints
      const [salon] = await query(
        `SELECT 
          s.*,
          COUNT(c.id) as total_complaints,
          SUM(CASE WHEN c.is_read = FALSE THEN 1 ELSE 0 END) as unread_complaints
        FROM salons s
        LEFT JOIN complaints c ON s.id = c.salon_id
        WHERE s.id = ?
        GROUP BY s.id`,
        [salonId]
      );

      if (!salon) {
        return NextResponse.json(
          { success: false, message: "Salon not found" },
          { status: 404 }
        );
      }

      // Get complaints for this specific salon
      const complaints = await query(
        `SELECT 
          c.*, 
          u.full_name, 
          u.email, 
          u.image as user_image,
          u.phone_number
        FROM complaints c
        INNER JOIN users u ON c.user_id = u.id
        WHERE c.salon_id = ?
        ORDER BY c.created_at DESC`,
        [salonId]
      );

      salonsWithComplaints = {
        ...salon,
        complaints: complaints
      };
    } else {
      // Get all salons with their complaint counts
      const salons = await query(
        `SELECT 
          s.*,
          COUNT(c.id) as total_complaints,
          SUM(CASE WHEN c.is_read = FALSE THEN 1 ELSE 0 END) as unread_complaints
        FROM salons s
        LEFT JOIN complaints c ON s.id = c.salon_id
        GROUP BY s.id
        ORDER BY total_complaints DESC, s.salon_name ASC`
      );

      // Get detailed complaints for each salon
      salonsWithComplaints = await Promise.all(
        salons.map(async (salon) => {
          const complaints = await query(
            `SELECT 
              c.*, 
              u.full_name, 
              u.email, 
              u.image as user_image,
              u.phone_number
            FROM complaints c
            INNER JOIN users u ON c.user_id = u.id
            WHERE c.salon_id = ?
            ORDER BY c.created_at DESC
            LIMIT 5`, // Limit to recent 5 complaints per salon
            [salon.id]
          );

          return {
            ...salon,
            complaints: complaints,
            has_more_complaints: salon.total_complaints > 5
          };
        })
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: salonsWithComplaints 
    });
  } catch (error) {
    console.error("GET salons with complaints error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch salons with complaints" },
      { status: 500 }
    );
  }
});