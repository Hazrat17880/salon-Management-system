import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnection";
import bcrypt from "bcryptjs"; // make sure to install: npm install bcryptjs

export async function POST(req) {
  try {
    const body = await req.json();
    const { email,  newPassword } = body;
    console.log("your email :",email);

    

    console.log("your newPassword :",newPassword);


    // ✅ Validate input
    if (!email  || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP, and new password are required" },
        { status: 400 }
      );
    }

    // ✅ Get admin from DB
    const user = await query("SELECT * FROM admin_auth WHERE email = ?", [email]);
    if (user.length === 0) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    const admin = user[0];

    

    // ✅ Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // ✅ Update password and clear OTP
    await query(
      `UPDATE admin_auth 
       SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE email = ?`,
      [hashedPassword, email]
    );

    return NextResponse.json({
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}