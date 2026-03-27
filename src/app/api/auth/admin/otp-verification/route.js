import { NextResponse } from "next/server";
import { query } from "@/lib/dbConnection";
export async function POST(req) {
    console.log("your otp function is calling");
  try {
    const body = await req.json();
    const { email, otp } = body;
    console.log("your email are :",email);
    console.log("your password are :",otp);

    // 🔴 Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // 🔹 Get user from DB
    const user = await query(
      "SELECT * FROM admin_auth WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return NextResponse.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    const admin = user[0];

    // 🔴 Check OTP match
    if (admin.otp_code !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // 🔴 Check expiry
    if (!admin.otp_expires_at || new Date() > new Date(admin.otp_expires_at)) {
      return NextResponse.json(
        { message: "OTP expired" },
        { status: 400 }
      );
    }

    // ✅ OTP is valid → clear it (important)
    await query(
      `UPDATE admin_auth 
       SET otp_code = NULL, otp_expires_at = NULL 
       WHERE email = ?`,
      [email]
    );

    // (Optional) mark verified
    await query(
      `UPDATE admin_auth 
       SET is_verified = true 
       WHERE email = ?`,
      [email]
    );

    return NextResponse.json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error("❌ Verify OTP Error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}