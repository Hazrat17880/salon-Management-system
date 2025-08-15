import { withSalonAuth } from '@/lib/authSalon';
import { query } from '@/lib/dbConnection';
import { deleteOldImage, saveUploadedFile } from '@/middleware/ImageSaveDelete';
import path from 'path';

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/salons');
const UPLOAD_PATH_PREFIX = '/uploads/salons/';

// Helper function to create consistent responses
function createResponse({ success, message, data = null, status = 200 }) {
  return new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// GET - Get salon profile
const getProfileHandler = async (request) => {
  try {
    const [salon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, is_verified, active, license, id_card,
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

    return createResponse({
      success: true,
      message: 'Salon profile retrieved successfully',
      data: salon
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
      'SELECT id_card, license FROM salons WHERE id = ?',
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
    const idCardFile = formData.get('id_card');
    const licenseFile = formData.get('license');

    if (idCardFile && idCardFile.size > 0) {
      if (!idCardFile.type.startsWith('image/') && !idCardFile.type.includes('pdf')) {
        return createResponse({
          success: false,
          message: 'ID card must be an image or PDF file',
          status: 400
        });
      }
      // Delete old file if exists
      if (currentSalon.id_card) {
        await deleteOldImage(currentSalon.id_card, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.id_card = await saveUploadedFile(idCardFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
    }

    if (licenseFile && licenseFile.size > 0) {
      if (!licenseFile.type.startsWith('image/') && !licenseFile.type.includes('pdf')) {
        return createResponse({
          success: false,
          message: 'License must be an image or PDF file',
          status: 400
        });
      }
      // Delete old file if exists
      if (currentSalon.license) {
        await deleteOldImage(currentSalon.license, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.license = await saveUploadedFile(licenseFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
    }

    // Handle explicit file removal
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

    // Build SQL update query
    const updateFields = [];
    const params = [];
    
    for (const [field, value] of Object.entries(updateData)) {
      if (value !== null && value !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(value);
      }
    }

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
        days, opening_hours, description, is_verified, active,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE id = ?`,
      [request.salon.id]
    );

    return createResponse({
      success: true,
      message: 'Profile updated successfully',
      data: updatedSalon
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