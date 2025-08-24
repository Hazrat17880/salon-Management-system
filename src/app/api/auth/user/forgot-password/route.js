import { query } from "@/lib/dbConnection";
import generateOTP from "@/utils/otp";
import { sendOTPEmail } from "@/utils/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const data = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (data.length === 0) {
      return NextResponse.json({ message: "Account not found with this email" }, { status: 404 });
    }

    const user = data[0];
    const userName = user.full_name;

    // Generate OTP
    const otp_code = generateOTP();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update OTP in database
    await query(
      `UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?`,
      [otp_code, otp_expires_at, email]
    );

    // Send OTP email
    await sendOTPEmail(
      email,
      userName,
      otp_code,
      "Hi! This is your forgot password OTP. Please verify it within 15 minutes."
    );

    return NextResponse.json({
      message: "OTP has been sent successfully. Please verify within 15 minutes."
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
