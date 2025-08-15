import { query } from '@/lib/dbConnection';
import { withUserAuth } from '@/lib/authUser';
import bcrypt from 'bcryptjs';
// Helper function for consistent responses
const createResponse = ({ success, message, data = null, status = 200 }) => 
  new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// PUT - Update user password
const updatePasswordHandler = async (request) => {
  try {
    const { id } = request.user;
    const { current_password, new_password } = await request.json();

    // Validate required fields
    if (!current_password || !new_password) {
      return createResponse({
        success: false,
        message: 'Current password and new password are required',
        status: 400
      });
    }

    // Get current password hash
    const [user] = await query(
      'SELECT password_hash FROM users WHERE id = ?',
      [id]
    );

    if (!user) {
      return createResponse({
        success: false,
        message: 'User not found',
        status: 404
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return createResponse({
        success: false,
        message: 'Current password is incorrect',
        status: 401
      });
    }

    // Hash new password
    const salt =  await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(new_password,salt);

    // Update password
    await query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, id]
    );

    return createResponse({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Error updating password:', error);
    return createResponse({
      success: false,
      message: 'Failed to update password',
      status: 500,
      data: { error: error.message }
    });
  }
};

export const PUT = withUserAuth(updatePasswordHandler);