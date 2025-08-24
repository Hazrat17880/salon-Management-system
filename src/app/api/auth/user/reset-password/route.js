import { query } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    const { email, password } = await req.json(); // <- fixed missing await
    if (!email || !password) {
      return NextResponse.json({
        message: "Email and password are required to update the password",
      }, { status: 400 });
    }

    // Check if the user exists
    const user = await query(`SELECT * FROM users WHERE email = ?`, [email]);

    if (user.length === 0) {
      return NextResponse.json({
        message: "Sorry, no user found with this email",
      }, { status: 404 });
    }

    // Update the password (assuming column name is password_hash)
    await query(`UPDATE users SET password_hash = ? WHERE email = ?`, [password, email]);

    return NextResponse.json({
      message: "Your password has been updated successfully",
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({
      message: "Something went wrong while updating password",
    }, { status: 500 });
  }
}
