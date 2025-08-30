import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withAdminAuth } from '@/lib/authAdmin';

export const GET = withAdminAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get('salonId');

  try {
    let salonsWithFeedbacks;

    if (salonId) {
      // Get specific salon with its reviews
      const [salon] = await query(
        `SELECT 
          s.*,
          COUNT(r.id) as total_feedbacks,
          AVG(r.stars) as average_rating
        FROM salons s
        LEFT JOIN review r ON s.id = r.salon_id
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

      // Get reviews for this specific salon
      const feedbacks = await query(
        `SELECT 
          r.*, 
          u.full_name, 
          u.email, 
          u.image as user_image,
          u.phone_number
        FROM review r
        INNER JOIN users u ON r.user_id = u.id
        WHERE r.salon_id = ?
        ORDER BY r.created_at DESC`,
        [salonId]
      );

      salonsWithFeedbacks = {
        ...salon,
        feedbacks: feedbacks,
        average_rating: salon.average_rating ? parseFloat(salon.average_rating).toFixed(1) : '0.0'
      };
    } else {
      // Get all salons with their review counts and ratings
      const salons = await query(
        `SELECT 
          s.*,
          COUNT(r.id) as total_feedbacks,
          AVG(r.stars) as average_rating
        FROM salons s
        LEFT JOIN review r ON s.id = r.salon_id
        GROUP BY s.id
        ORDER BY total_feedbacks DESC, s.salon_name ASC`
      );

      // Get detailed reviews for each salon
      salonsWithFeedbacks = await Promise.all(
        salons.map(async (salon) => {
          const feedbacks = await query(
            `SELECT 
              r.*, 
              u.full_name, 
              u.email, 
              u.image as user_image,
              u.phone_number
            FROM review r
            INNER JOIN users u ON r.user_id = u.id
            WHERE r.salon_id = ?
            ORDER BY r.created_at DESC
            LIMIT 5`, // Limit to recent 5 reviews per salon
            [salon.id]
          );

          return {
            ...salon,
            feedbacks: feedbacks,
            has_more_feedbacks: salon.total_feedbacks > 5,
            average_rating: salon.average_rating ? parseFloat(salon.average_rating).toFixed(1) : '0.0'
          };
        })
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: salonsWithFeedbacks 
    });
  } catch (error) {
    console.error("GET salons with feedbacks error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch salons with feedbacks" },
      { status: 500 }
    );
  }
});

// Simple endpoint to mark reviews as processed (using existing updated_at field)
export const PUT = withAdminAuth(async (req) => {
  try {
    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Review ID is required" },
        { status: 400 }
      );
    }

    // Update the updated_at timestamp to indicate this review has been processed
    await query(
      `UPDATE review SET updated_at = NOW() WHERE id = ?`,
      [id]
    );

    return NextResponse.json({ 
      success: true, 
      message: "Review marked as processed" 
    });
  } catch (error) {
    console.error("UPDATE review error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update review" },
      { status: 500 }
    );
  }
});