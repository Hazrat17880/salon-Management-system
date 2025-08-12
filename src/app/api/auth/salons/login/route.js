import { query } from '@/lib/dbConnection';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Helper functions
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

// POST - Salon login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createResponse(
        { success: false, message: 'Email and password are required' },
        400
      );
    }

    // Find salon by email
    const [salon] = await query(
      `SELECT id, email, password_hash, is_verified FROM salons WHERE email = ?`,
      [email]
    );

    if (!salon) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // Check if verified
    if (!salon.is_verified) {
      return createResponse(
        { 
          success: false, 
          message: 'Account not verified. Please check your email.',
          needsVerification: true
        },
        403
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, salon.password_hash);
    if (!isMatch) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { id: salon.id, email: salon.email, role: 'salon' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = createResponse({
      success: true,
      message: 'Login successful',
      salon: {
        id: salon.id,
        email: salon.email
      }
    });

    // Set cookie in the response
    cookies().set({
      name: 'salonstoken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    return handleError(error, 'login salon');
  }
}