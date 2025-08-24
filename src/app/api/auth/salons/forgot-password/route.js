import { query } from "@/lib/dbConnection";
import generateOTP from "@/utils/otp";
import { sendOTPEmail } from "@/utils/sendEmail";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse body safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Invalid JSON received:", err);
      return NextResponse.json(
        { message: "Invalid request format. Please send valid JSON." },
        { status: 400 }
      );
    }

    const { email } = body;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if salon exists
    const data = await query("SELECT * FROM salons WHERE email = ?", [email]);
    if (data.length === 0) {
      return NextResponse.json(
        { message: "No salon account found with this email" },
        { status: 404 }
      );
    }

    const salon = data[0];
    const salonName = salon.salon_name || "Salon User"; // fallback if null

    // Generate OTP
    const otp_code = generateOTP();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update OTP in database
    await query(
      `UPDATE salons SET otp_code = ?, otp_expires_at = ? WHERE email = ?`,
      [otp_code, otp_expires_at, email]
    );

    // Send OTP email
    await sendOTPEmail(
      email,
      salonName,
      otp_code,
      "Hi! This is your forgot password OTP. Please verify it within 15 minutes."
    );

    return NextResponse.json({
      message:
        "OTP has been sent successfully to your salon account. Please verify within 15 minutes.",
    });
  } catch (error) {
    console.error("Salon forgot password error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
