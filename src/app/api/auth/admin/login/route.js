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

// POST - Admin login
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return createResponse(
        { success: false, message: 'Email and password are required' },
        400
      );
    }

    // Find admin by email
    const [admin] = await query(
      `SELECT id, email, password_hash
       FROM admin_auth 
       WHERE email = ?`,
      [email]
    );

    if (!admin) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

  

  

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return createResponse(
        { success: false, message: 'Invalid credentials' },
        401
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: admin.id, 
        email: admin.email, 
        role: 'admin' 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = createResponse({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email
      }
    });

    // Set cookie in the response
   await cookies().set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    return handleError(error, 'admin login');
  }
}

// GET - Get admin information
export async function GET(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return createResponse(
        { success: false, message: 'No authentication token found' },
        401
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token has admin role
    if (decoded.role !== 'admin') {
      return createResponse(
        { success: false, message: 'Invalid token role' },
        403
      );
    }

    // Get admin information from database
    const [admin] = await query(
      `SELECT id, email, is_verified, active, created_at, updated_at 
       FROM admin_auth 
       WHERE id = ?`,
      [decoded.id]
    );

    if (!admin) {
      return createResponse(
        { success: false, message: 'Admin not found' },
        404
      );
    }

    return createResponse({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        is_verified: admin.is_verified,
        active: admin.active,
        created_at: admin.created_at,
        updated_at: admin.updated_at
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return createResponse(
        { success: false, message: 'Invalid or expired token' },
        401
      );
    }
    return handleError(error, 'fetch admin information');
  }
}

// PUT - Update admin information
export async function PUT(request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('adminToken')?.value;

    if (!token) {
      return createResponse(
        { success: false, message: 'No authentication token found' },
        401
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if the token has admin role
    if (decoded.role !== 'admin') {
      return createResponse(
        { success: false, message: 'Invalid token role' },
        403
      );
    }

    const { email, currentPassword, newPassword } = await request.json();

    // Validate input
    if (!email) {
      return createResponse(
        { success: false, message: 'Email is required' },
        400
      );
    }

    // Get current admin data
    const [currentAdmin] = await query(
      `SELECT email, password_hash FROM admin_auth WHERE id = ?`,
      [decoded.id]
    );

    if (!currentAdmin) {
      return createResponse(
        { success: false, message: 'Admin not found' },
        404
      );
    }

    // Check if password change is requested
    if (newPassword) {
      if (!currentPassword) {
        return createResponse(
          { success: false, message: 'Current password is required to set a new password' },
          400
        );
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword, 
        currentAdmin.password_hash
      );

      if (!isCurrentPasswordValid) {
        return createResponse(
          { success: false, message: 'Current password is incorrect' },
          401
        );
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update admin with new password
      await query(
        `UPDATE admin_auth 
         SET email = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [email, newPasswordHash, decoded.id]
      );
    } else {
      // Update admin without changing password
      await query(
        `UPDATE admin_auth 
         SET email = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [email, decoded.id]
      );
    }

    return createResponse({
      success: true,
      message: 'Admin information updated successfully'
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return createResponse(
        { success: false, message: 'Invalid or expired token' },
        401
      );
    }
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return createResponse(
        { success: false, message: 'Email already exists' },
        409
      );
    }
    
    return handleError(error, 'update admin information');
  }
}

// Additional API for OTP verification (if needed)
export async function PATCH(request) {
  try {
    const { email, otpCode } = await request.json();

    if (!email || !otpCode) {
      return createResponse(
        { success: false, message: 'Email and OTP code are required' },
        400
      );
    }

    // Find admin by email and check OTP
    const [admin] = await query(
      `SELECT id, otp_code, otp_expires_at 
       FROM admin_auth 
       WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()`,
      [email, otpCode]
    );

    if (!admin) {
      return createResponse(
        { success: false, message: 'Invalid or expired OTP code' },
        401
      );
    }

    // Clear OTP and mark as verified
    await query(
      `UPDATE admin_auth 
       SET otp_code = NULL, otp_expires_at = NULL, is_verified = TRUE 
       WHERE id = ?`,
      [admin.id]
    );

    return createResponse({
      success: true,
      message: 'Account verified successfully'
    });

  } catch (error) {
    return handleError(error, 'verify OTP');
  }
}