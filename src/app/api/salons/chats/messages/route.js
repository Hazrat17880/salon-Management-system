import { withSalonAuth } from "@/lib/authSalon";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (Salon fetch messages with a user) -----------------------
export const GET = withSalonAuth(async (req) => {
  const salonId = req.salon.id;
  const { searchParams } = new URL(req.url);
  const conversation_id = searchParams.get("conversation_id");

  if (!conversation_id) {
    return NextResponse.json(
      { success: false, message: "User ID is required" },
      { status: 400 }
    );
  }

  try {
    // Ensure conversation exists
    // let [conversation] = await query(
    //   `SELECT * FROM conversations WHERE salon_id = ? AND user_id = ? LIMIT 1`,
    //   [salonId, userId]
    // );

    // if (!conversation) {
    //   return NextResponse.json({ success: true, data: [] });
    // }

    const messages = await query(
      `SELECT * FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC`,
      [conversation_id]
    );

    // mark user messages as read
    await query(
      `UPDATE messages SET is_read = true WHERE conversation_id = ? AND sender_type = 'user'`,
      [conversation_id]
    );

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Salon GET messages error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
});

// ----------------------- POST (Salon send message to a user) -----------------------
export const POST = withSalonAuth(async (req) => {
  const salonId = req.salon.id;
  const body = await req.json();
  const { userId, message ,conversation_id} = body;
  console.log(body);
  let conversation = conversation_id
  if (!userId || !message ) {
    return NextResponse.json(
      { success: false, message: "User ID and message are required" },
      { status: 400 }
    );
  }

  try {
    if (!conversation_id) {
      const result = await query(
        `INSERT INTO conversations (salon_id, user_id) VALUES (?, ?)`,
        [salonId, userId]
      );
      [conversation] = await query(
        `SELECT * FROM conversations WHERE id = ?`,
        [result.insertId]
      );
       await query(
      `INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, 'salon', ?)`,
      [conversation.id, message]
    );
    return NextResponse.json({ success: true, message: "Message sent successfully!" });
    }

    await query(
      `INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, 'salon', ?)`,
      [conversation_id, message]
    );

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Salon POST messages error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
});

// ----------------------- DELETE (Salon delete conversation with a user) -----------------------
export const DELETE = withSalonAuth(async (req) => {
  const { searchParams } = new URL(req.url);
  const conversation_id = searchParams.get("conversation_id")

  if ( !conversation_id) {
    return NextResponse.json(
      { success: false, message: "User ID and Chat ID are required" },
      { status: 400 }
    );
  }
  try {
    // Delete all related messages first
    await query(`DELETE FROM messages WHERE conversation_id = ?`, [conversation_id]);

    // Delete the conversation
    await query(`DELETE FROM conversations WHERE id = ?`, [conversation_id]);

    return NextResponse.json({
      success: true,
      message: "Conversation and its messages deleted successfully!",
    });
  } catch (error) {
    console.error("Salon DELETE conversation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete conversation" },
      { status: 500 }
    );
  }
});