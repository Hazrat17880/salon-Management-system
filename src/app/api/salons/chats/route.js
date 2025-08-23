import { withSalonAuth } from "@/lib/authSalon";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (Salon fetch all conversations with users) -----------------------
export const GET = withSalonAuth(async (req) => {
  const salonId = req.salon.id;

  try {
    const conversations = await query(
      `
      SELECT 
        c.id AS conversation_id,
        u.id AS user_id,
        u.full_name AS user_name,
        u.image AS user_image,
        c.updated_at AS last_updated
      FROM conversations c
      INNER JOIN users u ON u.id = c.user_id
      WHERE c.salon_id = ? AND u.active = 1
      ORDER BY c.updated_at DESC
      `,
      [salonId]
    );

    console.log(conversations, 'the conversition');
    if (!conversations.length) {
      return NextResponse.json({ success: true, data: [], message: "No conversations yet" });
    }

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error("Salon GET conversations error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
});
