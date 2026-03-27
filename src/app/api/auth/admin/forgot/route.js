import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/utils/sendEmail";
import { query } from "@/lib/dbConnection";


export async function POST(req) {
  console.log("your api is calling by admin");
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // 🔹 Check admin exists
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

    // 🔹 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔹 Expiry (5 minutes)
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // 🔹 Save OTP in DB
    await query(
      `UPDATE admin_auth 
       SET otp_code = ?, otp_expires_at = ? 
       WHERE email = ?`,
      [otp, expiry, email]
    );

    // 🔹 Send Email
    const emailSent = await sendOTPEmail(
      email,
      "Admin",
      otp,
      "Your OTP Code"
    );

    if (!emailSent) {
      return NextResponse.json(
        { message: "Failed to send OTP email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("❌ Send OTP Error:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}