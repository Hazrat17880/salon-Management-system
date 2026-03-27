// app/api/admin/forgot-password/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { sendOTPEmail } from '@/utils/sendEmail';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin exists in database
    const admins = await query(
      'SELECT id, email FROM admin_auth WHERE email = ? AND active = true',
      [email]
    );

    if (admins.length === 0) {
      // Return success even if email not found (security best practice)
      return NextResponse.json({
        message: 'If your email exists in our system, you will receive reset instructions.'
      });
    }

    const admin = admins[0];

    // Generate OTP (6-digit)
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Set OTP expiry (15 minutes from now)
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    // Store OTP in database
    await query(
      'UPDATE admin_auth SET otp_code = ?, otp_expires_at = ? WHERE id = ?',
      [otp, otpExpiresAt, admin.id]
    );

    // Send OTP via email
    const emailSent = await sendOTPEmail(
      email,
      'Admin',
      otp,
      'Password Reset OTP - YongSMS'
    );

    if (!emailSent) {
      console.error('Failed to send OTP email to:', email);
      // Don't expose email failure to client
    }

    return NextResponse.json({
      message: 'If your email exists in our system, you will receive reset instructions.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}