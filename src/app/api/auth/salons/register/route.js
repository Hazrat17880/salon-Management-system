import bcrypt from 'bcryptjs';
import { query } from '@/lib/dbConnection';
import generateOTP from '@/utils/otp';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/salons');
const UPLOAD_PATH_PREFIX = '/uploads/salons/';

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

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
}

// Save uploaded file and return the public URL
async function saveUploadedFile(file) {
  await ensureUploadDir();
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const fileBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(fileBuffer));
  return `${UPLOAD_PATH_PREFIX}${fileName}`;
}

// GET - List all salons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const state = searchParams.get('state');
    const verified = searchParams.get('verified');

    let sql = `SELECT 
      id, salon_name, owner_name, email, phone_number, 
      street, city, state, country, postal_code,
      days, opening_hours, description, is_verified,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
      DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
    FROM salons WHERE 1=1`;
    const params = [];

    if (city) {
      sql += ` AND city LIKE ?`;
      params.push(`%${city}%`);
    }

    if (state) {
      sql += ` AND state LIKE ?`;
      params.push(`%${state}%`);
    }

    if (verified) {
      sql += ` AND is_verified = ?`;
      params.push(verified === 'true' ? 1 : 0);
    }

    sql += ` ORDER BY created_at DESC`;

    const salons = await query(sql, params);

    // Remove sensitive data
    const sanitizedSalons = salons.map(salon => {
      const { password_hash, otp_code, otp_expires_at, id_card, license, ...rest } = salon;
      return rest;
    });

    return createResponse({ success: true, data: sanitizedSalons });
  } catch (error) {
    return handleError(error, 'fetch salons');
  }
}

// POST - Create new salon with image uploads
export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract text fields
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
      description: formData.get('description')
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

    // Check if email exists
    const existing = await query('SELECT id FROM salons WHERE email = ?', [salonData.email]);
    if (existing.length > 0) {
      return createResponse(
        { success: false, message: 'Email already registered' },
        409
      );
    }

    // Handle image uploads
    const idCardFile = formData.get('id_card');
    const licenseFile = formData.get('license');

    let idCardUrl = null;
    let licenseUrl = null;

    if (idCardFile && idCardFile.size > 0) {
      if (!idCardFile.type.startsWith('image/')) {
        return createResponse(
          { success: false, message: 'ID card must be an image file' },
          400
        );
      }
      idCardUrl = await saveUploadedFile(idCardFile);
    }

    if (licenseFile && licenseFile.size > 0) {
      if (!licenseFile.type.startsWith('image/')) {
        return createResponse(
          { success: false, message: 'License must be an image file' },
          400
        );
      }
      licenseUrl = await saveUploadedFile(licenseFile);
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
        street_info, city, state, country, postal_code,
        days, opening_hours, description, id_card, license,
        otp_code, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        idCardUrl,
        licenseUrl,
        otp_code,
        otp_expires_at
      ]
    );

   

    // Get the created salon (without sensitive data)
    const [newSalon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, is_verified, active,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
      FROM salons WHERE id = ?`,
      [result.insertId]
    );

    // Set email cookie for verification
    cookies().set('email', salonData.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
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