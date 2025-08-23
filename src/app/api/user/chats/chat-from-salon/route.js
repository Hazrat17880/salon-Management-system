import { withUserAuth } from "@/lib/authUser";
import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// ----------------------- GET (User fetch messages with a salon) -----------------------
export const GET = withUserAuth(async (req) => {
  const userId = req.user.id
  const { searchParams } = new URL(req.url);
  const salonId = searchParams.get("salon_id");
  const conversation_id = searchParams.get("conversation_id")


  try {
  if (!conversation_id) {
    const [conversation] = await query(
      `SELECT * FROM conversations  where salon_id = ? AND  user_id = ? 
       ORDER BY created_at ASC`,
      [salonId, userId]
    );
    if (conversation) {
      // get the messages
      const messages = await query(
        `SELECT * FROM messages 
       WHERE conversation_id = ? 
       ORDER BY created_at ASC`,
        [conversation.id]
      );
      await query(
        `UPDATE messages SET is_read = true WHERE conversation_id = ? AND sender_type = 'user'`,
        [conversation_id]
      );
      return NextResponse.json({ success: true, data: messages, conversation_id: conversation.conversation_id });
    }

  }

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

    return NextResponse.json({ success: true, data: messages, conversation_id: conversation_id });
  } catch (error) {
    console.error("Salon GET messages error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
});











// ----------------------- POST (User send message to a salon) -----------------------
export const POST = withUserAuth(async (req) => {
try {
    const userId = req.user.id;
  const body = await req.json();
  const { salonId, message } = body;
  if (!salonId || !message) {
    return NextResponse.json(
      { success: false, message: "User ID and message are required" },
      { status: 400 }
    );
  }

  let conversation = await query(`SELECT * FROM conversations WHERE user_id = ? AND  salon_id = ?`,[userId, salonId])
  if(conversation.length >0){
     await query(
        `INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, 'user', ?)`,
        [conversation[0].id, message]
      );
      return NextResponse.json({ success: true, message: "Message sent successfully!" });

  }else{
    const result = await query(
        `INSERT INTO conversations (salon_id,  user_id) VALUES (?,?)`,
        [salonId, userId]
      );
      // [conversation] = await query(
      //   `SELECT * FROM conversations WHERE id = ?`,
      //   [result.insertId]
      // );
      await query(
        `INSERT INTO messages (conversation_id, sender_type, message) VALUES (?, ?, ?)`,
        [result.insertId, 'user', message]
      );
      return NextResponse.json({ success: true, message: "Message sent successfully!" });
  }
} catch (error) {
   return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
}
});




// ----------------------- DELETE (User delete conversation with a salon) -----------------------

