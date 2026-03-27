// app/api/admin/verify-otp/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    // Find admin with this email and valid OTP
    const admins = await query(
      `SELECT id, email, otp_code, otp_expires_at, is_verified, active 
       FROM admin_auth 
       WHERE email = ? AND active = true`,
      [email]
    );

    if (admins.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    const admin = admins[0];
    const now = new Date();
    const otpExpiresAt = new Date(admin.otp_expires_at);

    // Check if OTP exists
    if (!admin.otp_code) {
      return NextResponse.json(
        { error: 'No OTP request found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (now > otpExpiresAt) {
      // Clear expired OTP
      await query(
        'UPDATE admin_auth SET otp_code = NULL, otp_expires_at = NULL WHERE id = ?',
        [admin.id]
      );
      
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (admin.otp_code !== otp) {
      // Log failed attempt (optional)
      await query(
        `INSERT INTO otp_attempts (admin_id, attempted_otp, attempted_at, ip_address) 
         VALUES (?, ?, NOW(), ?)`,
        [admin.id, otp, request.headers.get('x-forwarded-for') || 'unknown']
      );

      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP verified successfully
    // Generate a reset token for password reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update admin record
    await query(
      `UPDATE admin_auth 
       SET otp_code = NULL, 
           otp_expires_at = NULL,
           reset_token = ?,
           reset_token_expires = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [resetToken, resetTokenExpires, admin.id]
    );

    // Log successful verification
    await query(
      `INSERT INTO otp_verifications (admin_id, verified_at, ip_address) 
       VALUES (?, NOW(), ?)`,
      [admin.id, request.headers.get('x-forwarded-for') || 'unknown']
    );

    return NextResponse.json({
      message: 'OTP verified successfully',
      verified: true,
      resetToken, // Send token to client for password reset
      expiresIn: 600 // 10 minutes in seconds
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}