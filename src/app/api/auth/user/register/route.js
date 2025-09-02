import bcrypt from 'bcryptjs';
import { query } from '@/lib/dbConnection';
import generateOTP from '@/utils/otp';
import { cookies } from 'next/headers';
import { sendOTPEmail } from '@/utils/sendEmail';

// Helper functions (keep the same)
const createResponse = (data, status = 200) => 
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handleError = (error, context) => {
  console.error(`${context} Error:`, error);
  return createResponse(
    { success: false, message: `Failed to ${context}`, error: error.message },
    500
  );
};

// GET - List all users
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const gender = searchParams.get('gender');
    const verified = searchParams.get('verified');

    let sql = `SELECT 
      id, full_name, email, phone_number, 
      date_of_birth, gender, address, is_verified, active,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
    FROM users WHERE 1=1`;
    const params = [];

    if (city) {
      sql += ` AND address LIKE ?`;
      params.push(`%${city}%`);
    }

    if (gender) {
      sql += ` AND gender = ?`;
      params.push(gender);
    }

    if (verified) {
      sql += ` AND is_verified = ?`;
      params.push(verified === 'true' ? 1 : 0);
    }

    sql += ` ORDER BY created_at DESC`;

    const users = await query(sql, params);

    // Remove sensitive data
    const sanitizedUsers = users.map(user => {
      const { password_hash, otp_code, otp_expires_at, ...rest } = user;
      return rest;
    });

    return createResponse({ success: true, data: sanitizedUsers });
  } catch (error) {
    return handleError(error, 'fetch users');
  }
}

// POST - Create new user
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    const userData = {
      full_name: formData.get('fullName'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone_number: formData.get('phone'),
      date_of_birth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
      address: formData.get('address')
    };

    // Basic validation
    if (!userData.full_name || !userData.email || !userData.password) {
      return createResponse(
        { success: false, message: 'Full name, email, and password are required' },
        400
      );
    }

    // Check if email exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [userData.email]);
    if (existing.length > 0) {
      return createResponse(
        { success: false, message: 'Email already registered' },
        409
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(userData.password, salt);

    // Generate OTP
    const otp_code = generateOTP();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Insert new user
    const result = await query(
      `INSERT INTO users (
        full_name, email, password_hash, phone_number,
        date_of_birth, gender, address, otp_code, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userData.full_name,
        userData.email,
        password_hash,
        userData.phone_number,
        userData.date_of_birth,
        userData.gender,
        userData.address,
        otp_code,
        otp_expires_at
      ]
    );

    // In production, you would send the OTP via email
    
    // send email
    // let send = await sendOTPEmail(userData.email, userData.full_name, otp_code,'Verify You Account.')
    // console.log('OTP Code:', otp_code, send);

    // Get the created user (without sensitive data)
    const [newUser] = await query(
      `SELECT 
        id, full_name, email, phone_number, is_verified,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
      FROM users WHERE id = ?`,
      [result.insertId]
    );

    // Create response
    const response = createResponse(
      { 
        success: true, 
        message: 'User registered. Please check your email for verification.',
        data: newUser
      },
      201
    );

    // Set email cookie for verification
    await cookies().set({
      name: 'user_email',
      value: userData.email,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

    return response;

  } catch (error) {
    return handleError(error, 'create user');
  }
}