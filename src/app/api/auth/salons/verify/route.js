import { query } from '@/lib/dbConnection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// POST - Verify salon with OTP and set auth cookie
export async function POST(request) {
  try {
    const {  otp } = await request.json();
     const cookieStore = cookies();
     console.log(otp, request.json());
 const email = cookieStore.get('salon_email')?.value
    if (!email || !otp) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email and OTP are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Find salon with matching email and OTP
    const [salon] = await query(
      `SELECT id, email, otp_code, otp_expires_at FROM salons 
       WHERE email = ? AND otp_code = ?`,
      [email, otp]
    );

    if (!salon) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Invalid OTP or email' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if OTP is expired
    if (new Date(salon.otp_expires_at) < new Date()) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'OTP has expired' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mark as verified
    await query(
      `UPDATE salons SET 
       otp_code = NULL, 
       otp_expires_at = NULL 
       WHERE id = ?`,
      [salon.id]
    );

    // Create JWT token
    const token = jwt.sign(
      { 
        id: salon.id, 
        email: salon.email,
        role: 'salon' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set('salonstoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 , // 7 days
      path: '/',
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Salon verified successfully',
      salon: {
        id: salon.id,
        email: salon.email,
        isVerified: true
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to verify salon',
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}