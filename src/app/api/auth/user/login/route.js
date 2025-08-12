import { query } from '@/lib/dbConnection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper functions (keep the same)
const createResponse = (data, status = 200) => 
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handleError = (error, context) => {
  console.error(`${context} Error:`, error);
  return createResponse(
    { success: false, message: `Failed to ${context}` },
    500
  );
};

// POST - User login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createResponse(
        { success: false, message: 'Email and password are required' },
        400
      );
    }

    // Find user by email
    const [user] = await query(
      `SELECT id, email, password_hash, is_verified, active FROM users WHERE email = ?`,
      [email]
    );

    if (!user) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // Check if verified
    if (!user.is_verified) {
      return createResponse(
        { 
          success: false, 
          message: 'Account not verified. Please check your email.',
          needsVerification: true
        },
        403
      );
    }

    // Check if active
    if (!user.active) {
      return createResponse(
        { 
          success: false, 
          message: 'Account is not active. Please contact support.'
        },
        403
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = createResponse({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });

    // Set cookie in the response
    cookies().set({
      name: 'usertoken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    return handleError(error, 'login user');
  }
}