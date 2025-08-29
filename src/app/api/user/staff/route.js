import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {

    const { searchParams } = new URL(request.url);
    const salonId = searchParams.get('salon_id');

    if (!salonId) {
      return NextResponse.json(
        { success: false, message: 'Salon ID is required' },
        { status: 400 }
      );
    }

    // Get all staff members for the specified salon
    const staff = await query(`
      SELECT 
        *
      FROM staff 
      WHERE salon_id = ?
      ORDER BY created_at DESC
    `, [salonId]);

    return NextResponse.json({
      success: true,
      data: staff,
      total: staff.length
    });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}