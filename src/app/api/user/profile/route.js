import { withUserAuth } from '@/lib/authUser';
import { query } from '@/lib/dbConnection';
import { deleteOldImage, saveUploadedFile } from '@/middleware/ImageSaveDelete';
import path from 'path';
// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const UPLOAD_PATH_PREFIX = '/uploads/';
// Helper function for consistent responses
const createResponse = ({ success, message, data = null, status = 200 }) => 
  new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// GET - Get user profile information
const getProfileHandler = async (request) => {
  try {
    const { id } = request.user;

    // Get user data
    const [user] = await query(
      `SELECT 
        id, full_name, email, phone_number, date_of_birth,
        gender, address, is_verified, active, image,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
       FROM users WHERE id = ?`,
      [id]
    );

    if (!user) {
      return createResponse({
        success: false,
        message: 'User not found',
        status: 404
      });
    }

    return createResponse({
      success: true,
      message: 'Profile retrieved successfully',
      data: user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch profile',
      status: 500,
      data: { error: error.message }
    });
  }
};





 const updateProfileHandler = async (request) => {
  try {
    const { id } = request.user;
    const formData = await request.formData();
    
    // Get current user data to check for existing image
    const [currentUser] = await query(
      'SELECT image FROM users WHERE id = ?',
      [id]
    );
    
    // Extract text fields
    const updateData = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      gender: formData.get('gender'),
      address: formData.get('address')
    };

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // Delete old image if it exists
      if (currentUser?.image_url) {
        await deleteOldImage(currentUser.image_url, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      // Save new image
      updateData.image = await saveUploadedFile(imageFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
    }

    // Build the update query
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
    
    params.push(id);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    // Get the updated user
    const [updatedUser] = await query(
      `SELECT 
        id, full_name, email, phone_number, date_of_birth,
        gender, address, image, is_verified,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
       FROM users WHERE id = ?`,
      [id]
    );

    return createResponse({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return createResponse({
      success: false,
      message: 'Failed to update profile',
      status: 500,
      data: { error: error.message }
    });
  }
};

export const GET = withUserAuth(getProfileHandler);
export const PATCH = withUserAuth(updateProfileHandler);
export const PUT = withUserAuth(updateProfileHandler);
