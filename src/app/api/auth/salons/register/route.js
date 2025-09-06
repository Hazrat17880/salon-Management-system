import bcrypt from 'bcryptjs';
import { query } from '@/lib/dbConnection';
import generateOTP from '@/utils/otp';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { sendOTPEmail } from '@/utils/sendEmail';

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/salons');
const UPLOAD_PATH_PREFIX = '/uploads/salons/';

// ✅ Helper: Create JSON response using NextResponse
const createResponse = (data, status = 200) => {
  return NextResponse.json(data, { status });
};

// Helper for handling errors
const handleError = (error, context) => {
  console.error(`${context} Error:`, error);
  return createResponse(
    { success: false, message: `Failed to ${context}`, error: error.message },
    500
  );
};

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
    throw err;
  }
}

// Save uploaded file and return the public URL
async function saveUploadedFile(file) {
  if (!file || file.size === 0) return null;

  await ensureUploadDir();
  const fileExt = path.extname(file.name);
  const fileName = `${Date.now()}${fileExt}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const fileBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(fileBuffer));
  return `${UPLOAD_PATH_PREFIX}${fileName}`;
}

// =============================
// GET - List all salons
// =============================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const is_verified = searchParams.get('is_verified');
    const active = searchParams.get('active');

    let sql = `SELECT 
      id, salon_name, owner_name, email, phone_number, 
      street_info, city, state, country, postal_code,
      days, opening_hours, description, image,
      is_verified, active,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
    FROM salons WHERE 1=1`;

    let countSql = 'SELECT COUNT(*) as total FROM salons WHERE 1=1';
    const params = [];
    const countParams = [];

    if (city) {
      sql += ` AND city LIKE ?`;
      countSql += ` AND city LIKE ?`;
      params.push(`%${city}%`);
      countParams.push(`%${city}%`);
    }

    if (state) {
      sql += ` AND state LIKE ?`;
      countSql += ` AND state LIKE ?`;
      params.push(`%${state}%`);
      countParams.push(`%${state}%`);
    }

    if (is_verified) {
      sql += ` AND is_verified = ?`;
      countSql += ` AND is_verified = ?`;
      params.push(is_verified === 'true' ? 1 : 0);
      countParams.push(is_verified === 'true' ? 1 : 0);
    }

    if (active) {
      sql += ` AND active = ?`;
      countSql += ` AND active = ?`;
      params.push(active === 'true' ? 1 : 0);
      countParams.push(active === 'true' ? 1 : 0);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [countResult] = await query(countSql, countParams);
    const salons = await query(sql, params);

    const sanitizedSalons = salons.map(salon => {
      const { password_hash, otp_code, otp_expires_at, id_card, license, ...rest } = salon;
      return rest;
    });

    return createResponse({
      success: true,
      data: {
        salons: sanitizedSalons,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(countResult.total / limit),
          totalItems: countResult.total,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    return handleError(error, 'fetch salons');
  }
}

// =============================
// POST - Create new salon
// =============================
export async function POST(request) {
  try {
    const formData = await request.formData();

    const salonData = {
      salon_name: formData.get('salon_name'),
      owner_name: formData.get('owner_name'),
      email: formData.get('email'),
      password: formData.get('password'),
      phone_number: formData.get('phone_number'),
      street_info: formData.get('street_info'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      postal_code: formData.get('postal_code'),
      days: formData.get('days'),
      opening_hours: formData.get('opening_hours'),
      description: formData.get('description'),
    };

    // Basic validation
    const requiredFields = ['salon_name', 'owner_name', 'email', 'password'];
    const missingFields = requiredFields.filter(field => !salonData[field]);
    if (missingFields.length > 0) {
      return createResponse(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        400
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(salonData.email)) {
      return createResponse({ success: false, message: 'Invalid email format' }, 400);
    }

    const existing = await query('SELECT id FROM salons WHERE email = ?', [salonData.email]);
    if (existing.length > 0) {
      return createResponse({ success: false, message: 'Email already registered' }, 409);
    }

    // File uploads
    const idCardFile = formData.get('id_card');
    const licenseFile = formData.get('license');
    const salonImageFile = formData.get('image');

    const [idCardUrl, licenseUrl, imageUrl] = await Promise.all([
      saveUploadedFile(idCardFile),
      saveUploadedFile(licenseFile),
      saveUploadedFile(salonImageFile),
    ]);

    const validateImage = (file, fieldName) => {
      if (file && file.size > 0 && !file.type.startsWith('image/')) {
        throw new Error(`${fieldName} must be an image file`);
      }
    };

    try {
      validateImage(idCardFile, 'ID card');
      validateImage(licenseFile, 'License');
      validateImage(salonImageFile, 'Salon image');
    } catch (validationError) {
      return createResponse({ success: false, message: validationError.message }, 400);
    }

    // Password hash
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(salonData.password, salt);

    // OTP
    const otp_code = generateOTP();
    const otp_expires_at = new Date(Date.now() + 15 * 60 * 1000);

    const result = await query(
      `INSERT INTO salons (
        salon_name, owner_name, email, password_hash, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, image, id_card, license,
        otp_code, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        salonData.salon_name,
        salonData.owner_name,
        salonData.email,
        password_hash,
        salonData.phone_number,
        salonData.street_info,
        salonData.city,
        salonData.state,
        salonData.country,
        salonData.postal_code,
        salonData.days,
        salonData.opening_hours,
        salonData.description,
        imageUrl,
        idCardUrl,
        licenseUrl,
        otp_code,
        otp_expires_at,
      ]
    );

    const [newSalon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, image, is_verified, active,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
      FROM salons WHERE id = ?`,
      [result.insertId]
    );

    // Send OTP Email
    await sendOTPEmail(
      salonData.email,
      salonData.salon_name,
      otp_code,
      'Verify Your Salon Account within 15 minutes – YongSMS'
    );

    // ✅ Create response and attach cookie
    const response = createResponse(
      {
        success: true,
        message: 'Salon registered. Please check your email for verification.',
        data: newSalon,
      },
      201
    );

    response.cookies.set('salon_email', salonData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return handleError(error, 'create salon');
  }
}
