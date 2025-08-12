import { query } from '@/lib/db';
import bcrypt from 'bcryptjs';
import isAuthenticated from '@/middleware/authenticateAdmin';

const createResponse = (data, status = 200) => 
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// GET - Get single salon
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const [salon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        address, city, opening_hours, services, is_verified,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE id = ?`,
      [id]
    );

    if (!salon) {
      return createResponse(
        { success: false, message: 'Salon not found' },
        404
      );
    }

    return createResponse({ success: true, data: salon });
  } catch (error) {
    return handleError(error, 'fetch salon');
  }
}

// PUT - Update salon
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const userId = await isAuthenticated(request);
    
    if (!userId) {
      return createResponse(
        { success: false, message: 'Unauthorized' },
        401
      );
    }

    const formData = await request.formData();
    const updateData = {
      salon_name: formData.get('salon_name'),
      owner_name: formData.get('owner_name'),
      phone_number: formData.get('phone_number'),
      address: formData.get('address'),
      city: formData.get('city'),
      opening_hours: formData.get('opening_hours'),
      services: formData.get('services')
    };

    // Check if salon exists
    const [existing] = await query('SELECT id FROM salons WHERE id = ?', [id]);
    if (!existing) {
      return createResponse(
        { success: false, message: 'Salon not found' },
        404
      );
    }

    // Update salon
    await query(
      `UPDATE salons SET
        salon_name = ?,
        owner_name = ?,
        phone_number = ?,
        address = ?,
        city = ?,
        opening_hours = ?,
        services = ?
      WHERE id = ?`,
      [
        updateData.salon_name,
        updateData.owner_name,
        updateData.phone_number,
        updateData.address,
        updateData.city,
        updateData.opening_hours,
        updateData.services,
        id
      ]
    );

    // Get updated salon
    const [updatedSalon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        address, city, opening_hours, services, is_verified,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE id = ?`,
      [id]
    );

    return createResponse({ success: true, data: updatedSalon });
  } catch (error) {
    return handleError(error, 'update salon');
  }
}

// DELETE - Remove salon
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const userId = await isAuthenticated(request);
    
    if (!userId) {
      return createResponse(
        { success: false, message: 'Unauthorized' },
        401
      );
    }

    // Check if salon exists
    const [existing] = await query('SELECT id FROM salons WHERE id = ?', [id]);
    if (!existing) {
      return createResponse(
        { success: false, message: 'Salon not found' },
        404
      );
    }

    // Delete salon
    await query('DELETE FROM salons WHERE id = ?', [id]);

    return createResponse(
      { success: true, message: 'Salon deleted successfully' }
    );
  } catch (error) {
    return handleError(error, 'delete salon');
  }
}