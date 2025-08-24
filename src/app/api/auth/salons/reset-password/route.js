import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required to reset password" },
        { status: 400 }
      );
    }

    // Check if salon exists
    const salon = await query(`SELECT * FROM salons WHERE email = ?`, [email]);

    if (salon.length === 0) {
      return NextResponse.json(
        { message: "No salon found with this email" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password in salons table
    await query(
      `UPDATE salons SET password_hash = ? WHERE email = ?`,
      [hashedPassword, email]
    );

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { message: "Something went wrong while resetting password" },
      { status: 500 }
    );
  }
}
