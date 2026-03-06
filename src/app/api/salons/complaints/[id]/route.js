// app/api/salons/complaints/[id]/route.js
import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// PATCH - Update complaint (mark as read, update status, etc.)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Get salon ID from token
    const cookieStore = cookies();
    const token = cookieStore.get('salonstoken')?.value || cookieStore.get('salontoken')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Verify token and get salon ID
    let salonId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      salonId = decoded.id;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    // Check if complaint exists and belongs to this salon
    const [complaint] = await query(
      `SELECT id, salon_id FROM complaints WHERE id = ?`,
      [id]
    );

    if (!complaint) {
      return NextResponse.json({ 
        success: false, 
        message: 'Complaint not found' 
      }, { status: 404 });
    }

    // Verify this complaint belongs to the salon
    if (complaint.salon_id !== salonId) {
      return NextResponse.json({ 
        success: false, 
        message: 'You do not have permission to update this complaint' 
      }, { status: 403 });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];

    if (body.is_read !== undefined) {
      updates.push('is_read = ?');
      values.push(body.is_read ? 1 : 0);
    }

    if (body.status !== undefined) {
      // Validate status
      const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Invalid status value' 
        }, { status: 400 });
      }
      updates.push('status = ?');
      values.push(body.status);
      
      // If status is resolved, add resolved_at timestamp
      if (body.status === 'resolved') {
        updates.push('resolved_at = NOW()');
      }
    }

    if (body.admin_notes !== undefined) {
      updates.push('admin_notes = ?');
      values.push(body.admin_notes);
    }

    if (updates.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No fields to update' 
      }, { status: 400 });
    }

    // Add updated_at timestamp
    updates.push('updated_at = NOW()');
    
    // Add the complaint ID to values array
    values.push(id);

    // Execute update query
    const result = await query(
      `UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to update complaint' 
      }, { status: 500 });
    }

    // Fetch the updated complaint to return
    const [updatedComplaint] = await query(
      `SELECT 
          c.*,
          u.full_name as user_name,
          u.email as user_email,
          u.phone_number as user_phone
       FROM complaints c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update complaint',
      error: error.message 
    }, { status: 500 });
  }
}

// GET - Fetch single complaint
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Get salon ID from token
    const cookieStore = cookies();
    const token = cookieStore.get('salonstoken')?.value || cookieStore.get('salontoken')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Verify token and get salon ID
    let salonId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      salonId = decoded.id;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    // Fetch complaint with user details
    const [complaint] = await query(
      `SELECT 
          c.*,
          u.full_name as user_name,
          u.email as user_email,
          u.phone_number as user_phone,
          u.profile_image as user_image
       FROM complaints c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ? AND c.salon_id = ?`,
      [id, salonId]
    );

    if (!complaint) {
      return NextResponse.json({ 
        success: false, 
        message: 'Complaint not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: complaint
    });

  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch complaint',
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a complaint
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Get salon ID from token
    const cookieStore = cookies();
    const token = cookieStore.get('salonstoken')?.value || cookieStore.get('salontoken')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    // Verify token and get salon ID
    let salonId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      salonId = decoded.id;
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token' 
      }, { status: 401 });
    }

    // Check if complaint exists and belongs to this salon
    const [complaint] = await query(
      `SELECT id, salon_id FROM complaints WHERE id = ?`,
      [id]
    );

    if (!complaint) {
      return NextResponse.json({ 
        success: false, 
        message: 'Complaint not found' 
      }, { status: 404 });
    }

    if (complaint.salon_id !== salonId) {
      return NextResponse.json({ 
        success: false, 
        message: 'You do not have permission to delete this complaint' 
      }, { status: 403 });
    }

    // Delete the complaint
    await query(
      `DELETE FROM complaints WHERE id = ?`,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: 'Complaint deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete complaint',
      error: error.message 
    }, { status: 500 });
  }
}