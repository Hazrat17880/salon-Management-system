// app/api/salons/[id]/route.js
import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

const get = async(req)=> {
  const { searchParams } = new URL(req.url);
     const  id = parseInt(searchParams.get('id'))
  if (!id) {
    return NextResponse.json({
      success: false,
      message: "Salon ID is required",
    }, { status: 400 });
  }

  try {
    // Get salon details
    const [salon] = await query(
      "SELECT * FROM salons WHERE id = ?",
      [id]
    );

    if (!salon) {
      return NextResponse.json({
        success: false,
        message: "Salon not found",
      }, { status: 404 });
    }

    // Get salon services
    const services = await query(
      "SELECT * FROM salon_services WHERE salon_id = ?",
      [id]
    );

    const staff = await query(
      `
      SELECT * FROM staff WHERE salon_id=?
      `,[id]
    )
    return NextResponse.json({
      success: true,
      data: {
        salon,
        services,
        favorite:[],
        staff
      },
    });
  } catch (error) {
    console.error("Error fetching salon details:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch salon details",
    }, { status: 500 });
  }
}


export const GET = get