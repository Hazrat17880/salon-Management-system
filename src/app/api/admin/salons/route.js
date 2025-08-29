import { authAdmin } from '@/lib/authAdmin';
import { query } from '@/lib/dbConnection';

// Helper functions
const createResponse = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const handleError = (error, context) => {
  console.error(`${context} Error:`, error);
  return createResponse(
    { success: false, message: `Failed to ${context}` },
    500
  );
};

// ================== GET ==================
export async function GET(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const salons = await query(`
      SELECT 
        *
      FROM salons
      ORDER BY created_at DESC
    `);

    return createResponse({ success: true, data: salons });
  } catch (error) {
    return handleError(error, 'fetch salons');
  }
}

// ================== PATCH ==================
export async function PATCH(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'status' or 'verification'
    
    if (action === 'verification') {
      return await updateVerificationStatus(request);
    }
    return await updateSalonStatus(request);
  } catch (error) {
    return handleError(error, 'update salon');
  }
}

async function updateSalonStatus(request) {
  try {
    const { salonId, active } = await request.json();
    if (!salonId || typeof active !== 'boolean') {
      return createResponse(
        { success: false, message: 'Salon ID and active status are required' },
        400
      );
    }

    const [salon] = await query('SELECT id, salon_name FROM salons WHERE id = ?', [salonId]);
    if (!salon) return createResponse({ success: false, message: 'Salon not found' }, 404);

    await query(
      'UPDATE salons SET active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [active, salonId]
    );

    return createResponse({
      success: true,
      message: `Salon ${active ? 'activated' : 'deactivated'} successfully`,
      data: { id: salonId, active, salon_name: salon.salon_name }
    });
  } catch (error) {
    return handleError(error, 'update salon status');
  }
}

async function updateVerificationStatus(request) {
  try {
    const { salonId, is_verified } = await request.json();
    if (!salonId || typeof is_verified !== 'boolean') {
      return createResponse(
        { success: false, message: 'Salon ID and verification status are required' },
        400
      );
    }

    const [salon] = await query('SELECT id, salon_name FROM salons WHERE id = ?', [salonId]);
    if (!salon) return createResponse({ success: false, message: 'Salon not found' }, 404);

    await query(
      'UPDATE salons SET is_verified = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [is_verified, salonId]
    );

    return createResponse({
      success: true,
      message: `Salon ${is_verified ? 'verified' : 'unverified'} successfully`,
      data: { id: salonId, is_verified, salon_name: salon.salon_name }
    });
  } catch (error) {
    return handleError(error, 'update salon verification status');
  }
}

// ================== PUT ==================
export async function PUT(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const { salonId, salon_name, owner_name, email, phone_number, street_info, city, state, country, postal_code, description } = await request.json();

    if (!salonId) {
      return createResponse({ success: false, message: 'Salon ID is required' }, 400);
    }

    const [salon] = await query('SELECT id FROM salons WHERE id = ?', [salonId]);
    if (!salon) return createResponse({ success: false, message: 'Salon not found' }, 404);

    await query(
      `UPDATE salons SET 
        salon_name = ?, owner_name = ?, email = ?, phone_number = ?, 
        street_info = ?, city = ?, state = ?, country = ?, postal_code = ?, 
        description = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [salon_name, owner_name, email, phone_number, street_info, city, state, country, postal_code, description, salonId]
    );

    return createResponse({
      success: true,
      message: 'Salon updated successfully',
      data: { id: salonId }
    });
  } catch (error) {
    return handleError(error, 'update salon details');
  }
}

// ================== DELETE ==================
export async function DELETE(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const { salonId } = await request.json();
    if (!salonId) return createResponse({ success: false, message: 'Salon ID is required' }, 400);

    const [salon] = await query('SELECT id, salon_name FROM salons WHERE id = ?', [salonId]);
    if (!salon) return createResponse({ success: false, message: 'Salon not found' }, 404);

    await query('DELETE FROM salons WHERE id = ?', [salonId]);

    return createResponse({
      success: true,
      message: 'Salon deleted successfully',
      data: { id: salonId, salon_name: salon.salon_name }
    });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return createResponse(
        { success: false, message: 'Cannot delete salon. Related records exist.' },
        409
      );
    }
    return handleError(error, 'delete salon');
  }
}