import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withAdminAuth } from '@/lib/authAdmin';

// GET all users
export const GET = withAdminAuth(async(request) => {
  try {
    // Verify admin authentication
  
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const verification = searchParams.get('verification') || 'all';

    // Build WHERE clause based on filters
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (full_name LIKE ? OR email LIKE ? OR phone_number LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      whereClause += ' AND active = ?';
      params.push(status === 'active' ? 1 : 0);
    }

    if (verification !== 'all') {
      whereClause += ' AND is_verified = ?';
      params.push(verification === 'verified' ? 1 : 0);
    }

    // Get all users with filters, ordered by most recent first
    const users = await query(`
      SELECT 
        id,
        full_name,
        email,
        image,
        phone_number,
        date_of_birth,
        gender,
        address,
        is_verified,
        active,
        created_at,
        updated_at
      FROM users 
      ${whereClause}
      ORDER BY created_at DESC
    `, params);

    return NextResponse.json({
      success: true,
      data: users,
      total: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
)

// PATCH - Update user status (active/inactive)
export const PATCH = withAdminAuth(async(request)=> {
  try {
  

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const body = await request.json();
    const { userId, active, is_verified } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (action === 'verification') {
      // Update verification status
      if (is_verified === undefined) {
        return NextResponse.json(
          { success: false, message: 'Verification status is required' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE users SET is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [is_verified, userId]
      );

      return NextResponse.json({
        success: true,
        message: `User ${is_verified ? 'verified' : 'unverified'} successfully`
      });

    } else {
      // Update active status
      if (active === undefined) {
        return NextResponse.json(
          { success: false, message: 'Active status is required' },
          { status: 400 }
        );
      }

      await query(
        'UPDATE users SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [active, userId]
      );

      return NextResponse.json({
        success: true,
        message: `User ${active ? 'activated' : 'deactivated'} successfully`
      });
    }

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
})

// DELETE - Delete a user
export const DELETE = withAdminAuth(async(request)=> {
  try {
    // Verify admin authentication
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated || !authResult.user?.isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await query('SELECT id FROM users WHERE id = ?', [userId]);
    
    if (user.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await query('DELETE FROM users WHERE id = ?', [userId]);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
})