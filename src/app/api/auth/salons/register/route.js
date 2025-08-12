import bcrypt from 'bcryptjs';
// import { sendVerificationEmail } from '@/lib/email';
import { query } from '@/lib/dbConnection';
import generateOTP from '@/utils/otp';
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
    { success: false, message: `Failed to ${context}`, error: error.message },
    500
  );
};

// GET - List all salons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const service = searchParams.get('service');
    const verified = searchParams.get('verified');

    let sql = `SELECT 
      id, salon_name, owner_name, email, phone_number, 
      address, city, opening_hours, services, is_verified,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
    FROM salons WHERE 1=1`;
    const params = [];

    if (city) {
      sql += ` AND city LIKE ?`;
      params.push(`%${city}%`);
    }

    if (service) {
      sql += ` AND services LIKE ?`;
      params.push(`%${service}%`);
    }

    if (verified) {
      sql += ` AND is_verified = ?`;
      params.push(verified === 'true' ? 1 : 0);
    }

    sql += ` ORDER BY created_at DESC`;

    const salons = await query(sql, params);

    // Remove sensitive data
    const sanitizedSalons = salons.map(salon => {
      const { password_hash, otp_code, otp_expires_at, ...rest } = salon;
      return rest;
    });

    return createResponse({ success: true, data: sanitizedSalons });
  } catch (error) {
    return handleError(error, 'fetch salons');
  }
}

// POST - Create new salon
export async function POST(request) {
  try {
    const formData = await request.formData();
    console.log(formData);
    const salonData = {
      salon_name: formData.get('salonName'),
      owner_name: formData.get('ownerName'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone_number: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      opening_hours: formData.get('openingHours'),
    };

    // Basic validation
    if (!salonData.salon_name || !salonData.owner_name || !salonData.email || !salonData.password) {
      return createResponse(
        { success: false, message: 'Missing required fields' },
        400
      );
    }

    // Check if email exists
    const existing = await query('SELECT id FROM salons WHERE email = ?', [salonData.email]);
    if (existing.length > 0) {
      return createResponse(
        { success: false, message: 'Email already registered' },
        409
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(salonData.password, salt);

    // Generate OTP
    const otp_code = generateOTP();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Insert new salon
    const result = await query(
      `INSERT INTO salons (
        salon_name, owner_name, email, password_hash, phone_number,
        address, city, opening_hours, otp_code, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,  ?)`,
      [
        salonData.salon_name,
        salonData.owner_name,
        salonData.email,
        password_hash,
        salonData.phone_number,
        salonData.address,
        salonData.city,
        salonData.opening_hours,
        otp_code,
        otp_expires_at
      ]
    );

    // Send verification email
    // await sendVerificationEmail(salonData.email, otp_code);
    console.log(otp_code);

    // Get the created salon (without sensitive data)
    const [newSalon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        address, city, opening_hours,  is_verified,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
      FROM salons WHERE id = ?`,
      [result.insertId]
    );
cookies().set('email', salonData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 , 
      path: '/',
    });

    return createResponse(
      { 
        success: true, 
        message: 'Salon registered. Please check your email for verification.',
        data: newSalon
      },
      201
    );
  } catch (error) {
    return handleError(error, 'create salon');
  }
}