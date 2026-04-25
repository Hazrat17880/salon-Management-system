import { query } from "@/lib/dbConnection";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    // check if admin already exists
    const existing = await query(
      "SELECT * FROM admin_auth WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return Response.json({ message: "Admin already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert admin
    await query(
      "INSERT INTO admin_auth (email, password_hash) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return Response.json({ message: "Admin created successfully" });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}