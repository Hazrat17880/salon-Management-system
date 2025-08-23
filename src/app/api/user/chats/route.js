import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export const GET = withUserAuth(async (req) => {
  const userId = req.user.id;

  try {
    const conversations = await query(
      `
      SELECT 
        c.id AS conversation_id,
        c.salon_id,
        s.salon_name AS salon_name,
        s.image AS salon_image,
        c.updated_at AS last_updated
      FROM conversations c
      INNER JOIN salons s ON s.id = c.salon_id
      WHERE c.user_id = ? AND s.active = 1
      ORDER BY c.updated_at DESC
      `,
      [userId]
    );

    console.log(conversations, 'teh data is now');
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
