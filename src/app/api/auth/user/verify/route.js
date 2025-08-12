import { query } from '@/lib/dbConnection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { otp } = await request.json();
    const cookieStore = cookies();
    const email = cookieStore.get('user_email')?.value;

    if (!email || !otp) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email and OTP are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find user with matching email and OTP
    const [user] = await query(
      `SELECT id, email, otp_code, otp_expires_at, is_verified FROM users 
       WHERE email = ? AND otp_code = ?`,
      [email, otp]
    );

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid OTP or email' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if OTP is expired
    if (new Date(user.otp_expires_at) < new Date()) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'OTP has expired' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mark as verified and active
    await query(
      `UPDATE users SET 
       is_verified = TRUE,
       active = TRUE,
       otp_code = NULL, 
       otp_expires_at = NULL 
       WHERE id = ?`,
      [user.id]
    );

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: 'user' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = new Response(JSON.stringify({ 
      success: true, 
      message: 'User verified successfully',
      user: {
        id: user.id,
        email: user.email,
        isVerified: true
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // Set cookie in response
    cookies().set({
      name: 'usertoken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Clear the email cookie
    cookies().set({
      name: 'user_email',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to verify user',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}