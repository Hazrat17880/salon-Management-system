import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (User fetch complaints) -----------------------
export const GET = withUserAuth(async (req) => {
  const userId = req.user.id;
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get("salon_id");
  const complaintId = searchParams.get("id");

  try {
    let complaints;

    if (complaintId) {
      // Get single complaint
      [complaints] = await query(
        `SELECT * FROM complaints WHERE id = ? AND user_id = ?`,
        [complaintId, userId]
      );
    } else if (salonId) {
      // Get complaints for specific salon
      complaints = await query(
        `SELECT * FROM complaints WHERE salon_id = ? AND user_id = ? ORDER BY created_at DESC`,
        [salonId, userId]
      );
    } else {
      // Get all complaints by this user
      complaints = await query(
        `SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
      );
    }

    return NextResponse.json({ success: true, data: complaints });
  } catch (error) {
    console.error("GET complaints error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
});

// ----------------------- POST (User creates a complaint) -----------------------
export const POST = withUserAuth(async (req) => {
  const userId = req.user.id;
  const body = await req.json();
  const { complaint_about, description, salon_id } = body;

  if (!complaint_about || !description || !salon_id) {
    return NextResponse.json(
      { success: false, message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const result = await query(
      `INSERT INTO complaints (complaint_about, description, salon_id, user_id) 
       VALUES (?, ?, ?, ?)`,
      [complaint_about, description, salon_id, userId]
    );

    return NextResponse.json({
      success: true,
      message: "Complaint submitted successfully",
      complaintId: result.insertId,
    });
  } catch (error) {
    console.error("POST complaint error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit complaint" },
      { status: 500 }
    );
  }
});

// ----------------------- PUT (User updates a complaint) -----------------------
export const PUT = withUserAuth(async (req) => {
  const userId = req.user.id;
    const { searchParams } = new URL(req.url);
const id = searchParams.get("id")
  const body = await req.json();
  const {complaint_about, description } = body;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "Complaint ID is required" },
      { status: 400 }
    );
  }

  try {
    await query(
      `UPDATE complaints 
       SET complaint_about = COALESCE(?, complaint_about),
           description = COALESCE(?, description),
           is_read = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [complaint_about, description, true, id, userId]
    );

    return NextResponse.json({ success: true, message: "Complaint updated" });
  } catch (error) {
    console.error("PUT complaint error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update complaint" },
      { status: 500 }
    );
  }
});

// ----------------------- DELETE (User deletes a complaint) -----------------------
export const DELETE = withUserAuth(async (req) => {
  const userId = req.user.id;
  const { searchParams } = new URL(req.url);
  const complaintId = searchParams.get("id");

  if (!complaintId) {
    return NextResponse.json(
      { success: false, message: "Complaint ID is required" },
      { status: 400 }
    );
  }

  try {
    await query(`DELETE FROM complaints WHERE id = ? AND user_id = ?`, [
      complaintId,
      userId,
    ]);

    return NextResponse.json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    console.error("DELETE complaint error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete complaint" },
      { status: 500 }
    );
  }
});
