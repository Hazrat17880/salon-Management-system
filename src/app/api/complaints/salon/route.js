import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withSalonAuth } from "@/lib/authSalon";

export const GET = withSalonAuth(async (req) => {
  const salonId = req.salon.id;
  const { searchParams } = new URL(req.url);
  const complaintId = searchParams.get('id');

  try {
    let complaints;


      // Get all complaints for this salon with user information
      complaints = await query(
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

    return NextResponse.json({ 
      success: true, 
      data: complaints 
    });
  } catch (error) {
    console.error("GET complaints error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
});