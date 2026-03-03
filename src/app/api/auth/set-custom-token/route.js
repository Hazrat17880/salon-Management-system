import { query } from '@/lib/dbConnection';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ success: false, message: 'Email required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get user from database
    const [user] = await query(
      `SELECT id, email FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set({
      name: 'usertoken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Custom token set successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error setting custom token:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to set custom token' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}