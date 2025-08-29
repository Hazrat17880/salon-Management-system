import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withSalonAuth } from '@/lib/authSalon';

// GET all reviews for the authenticated salon
export const GET = withSalonAuth(async(req) => {
  try {
    const salonId = req.salon.id;

    // Get all reviews for the authenticated salon with user information
    const reviews = await query(`
      SELECT 
        r.id,
        r.title,
        r.review,
        r.stars,
        r.user_id,
        r.salon_id,
        r.created_at,
        r.updated_at,
        u.full_name,
        u.email,
        u.image,
        s.salon_name
      FROM review r
      INNER JOIN users u ON r.user_id = u.id
      INNER JOIN salons s ON r.salon_id = s.id
      WHERE r.salon_id = ?
      ORDER BY r.created_at DESC
    `, [salonId]);

    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length,
      salonId: salonId
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});