import { withSalonAuth } from '@/lib/authSalon';
import { query } from '@/lib/dbConnection';
import { deleteOldImage, saveUploadedFile } from '@/middleware/ImageSaveDelete';
import path from 'path';

// Configure upload directories
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/salons');
const UPLOAD_PATH_PREFIX = '/uploads/salons/';

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
];

// Helper function to create consistent responses
function createResponse({ success, message, data = null, status = 200 }) {
  return new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// Validate uploaded files
const validateFile = (file) => {
  if (!file || file.size === 0) return null;
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }
  
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, WEBP, or PDF allowed');
  }
  
  return true;
};

// GET - Get salon profile
const getProfileHandler = async (request) => {
  try {
    const [salon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, image,
        is_verified, active, license, id_card,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE id = ?`,
      [request.salon.id]
    );

    if (!salon) {
      return createResponse({
        success: false,
        message: 'Salon not found',
        status: 404
      });
    }

    // Sanitize sensitive data
    const { password_hash, otp_code, otp_expires_at, ...sanitizedSalon } = salon;

    return createResponse({
      success: true,
      message: 'Salon profile retrieved successfully',
      data: sanitizedSalon
    });
  } catch (error) {
    console.error('Error fetching salon profile:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch salon profile',
      status: 500,
      data: { error: error.message }
    });
  }
};

// PUT/PATCH - Update salon profile
const updateProfileHandler = async (request) => {
  try {
    const formData = await request.formData();
    
    // Get current salon data to check for existing files
    const [currentSalon] = await query(
      'SELECT image, id_card, license FROM salons WHERE id = ?',
      [request.salon.id]
    );
    
    if (!currentSalon) {
      return createResponse({
        success: false,
        message: 'Salon not found',
        status: 404
      });
    }

    // Extract updatable fields
    const updateData = {
      salon_name: formData.get('salon_name'),
      owner_name: formData.get('owner_name'),
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

    // Handle file uploads
    const imageFile = formData.get('profile_image');
    const idCardFile = formData.get('id_card');
    const licenseFile = formData.get('license');

    try {
      // Process profile image
      if (imageFile && imageFile.size > 0) {
        validateFile(imageFile);
        if (currentSalon.image) {
          await deleteOldImage(currentSalon.image, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
        }
        updateData.image = await saveUploadedFile(imageFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
      }

      // Process ID card
      if (idCardFile && idCardFile.size > 0) {
        validateFile(idCardFile);
        if (currentSalon.id_card) {
          await deleteOldImage(currentSalon.id_card, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
        }
        updateData.id_card = await saveUploadedFile(idCardFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
      }

      // Process license
      if (licenseFile && licenseFile.size > 0) {
        validateFile(licenseFile);
        if (currentSalon.license) {
          await deleteOldImage(currentSalon.license, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
        }
        updateData.license = await saveUploadedFile(licenseFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
      }
    } catch (fileError) {
      return createResponse({
        success: false,
        message: fileError.message,
        status: 400
      });
    }

    // Handle explicit file removal
    if (formData.get('remove_image') === 'true') {
      if (currentSalon.image) {
        await deleteOldImage(currentSalon.image, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.image = null;
    }

    if (formData.get('remove_id_card') === 'true') {
      if (currentSalon.id_card) {
        await deleteOldImage(currentSalon.id_card, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.id_card = null;
    }

    if (formData.get('remove_license') === 'true') {
      if (currentSalon.license) {
        await deleteOldImage(currentSalon.license, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.license = null;
    }

    // Validate required fields
    const requiredFields = {
      salon_name: 'Salon name is required',
      owner_name: 'Owner name is required',
      phone_number: 'Phone number is required',
      street_info: 'Street address is required',
      city: 'City is required',
      state: 'State is required'
    };

    const missingFields = [];
    for (const [field, message] of Object.entries(requiredFields)) {
      if (!updateData[field] && !formData.get(field)) {
        missingFields.push(message);
      }
    }

    if (missingFields.length > 0) {
      return createResponse({
        success: false,
        message: missingFields.join(', '),
        status: 400
      });
    }

    // Build SQL update query
    const updateFields = [];
    const params = [];
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    for (const [field, value] of Object.entries(updateData)) {
      if (value !== null && value !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(value);
      }
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    params.push(now);

    if (updateFields.length === 0) {
      return createResponse({
        success: false,
        message: 'No fields to update',
        status: 400
      });
    }

    params.push(request.salon.id);
    const sql = `UPDATE salons SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    // Get the updated salon
    const [updatedSalon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, image,
        is_verified, active, license, id_card,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE id = ?`,
      [request.salon.id]
    );

    // Sanitize sensitive data
    const { password_hash, otp_code, otp_expires_at, ...sanitizedSalon } = updatedSalon;

    return createResponse({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizedSalon
    });
  } catch (error) {
    console.error('Error updating salon profile:', error);
    return createResponse({
      success: false,
      message: 'Failed to update salon profile',
      status: 500,
      data: { error: error.message }
    });
  }
};

// Export the handlers wrapped with salon authentication
export const GET = withSalonAuth(getProfileHandler);
export const PUT = withSalonAuth(updateProfileHandler);
export const PATCH = withSalonAuth(updateProfileHandler);