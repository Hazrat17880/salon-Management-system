import { withSalonAuth } from '@/lib/authSalon';
import { query } from '@/lib/dbConnection';
import { deleteOldImage, saveUploadedFile } from '@/middleware/ImageSaveDelete';
import path from 'path';

// Configure upload directory
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads/services');
const UPLOAD_PATH_PREFIX = '/uploads/services/';

// Helper function to create consistent responses
function createResponse({ success, message, data = null, status = 200 }) {
  return new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

// GET all services for the authenticated salon
const getServicesHandler = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    let sql = `SELECT * FROM salon_services WHERE salon_id = ?`;
    const params = [request.salon.id];
    
    if (category) {
      sql += ` AND main_category = ?`;
      params.push(category);
    }
    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    const services = await query(sql, params);
    
    return createResponse({
      success: true,
      message: 'Services retrieved successfully',
      data: services
    });

  } catch (error) {
    console.error('Error fetching salon services:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch salon services',
      status: 500,
      data: { error: error.message }
    });
  }
};

// POST - Create a new service for the authenticated salon
const createServiceHandler = async (request) => {
  try {
    const formData = await request.formData();
    
    // Extract text fields
    const serviceData = {
      main_category: formData.get('main_category'),
      sub_category: formData.get('sub_category'),
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      discount: formData.get('discount') || 0,
      special_days: formData.get('special_days'),
      available_start_time: formData.get('available_start_time'),
      available_end_time: formData.get('available_end_time'),
      duration_minutes: formData.get('duration_minutes') || 30,
      status: formData.get('status') || 'active'
    };

    // Validate required fields
    const requiredFields = ['main_category', 'sub_category', 'title', 'price'];
    const missingFields = requiredFields.filter(field => !serviceData[field]);
    
    if (missingFields.length > 0) {
      return createResponse({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        status: 400
      });
    }

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      serviceData.image_url = await saveUploadedFile(imageFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
    }

    // Insert new service with the authenticated salon's ID
    const result = await query(
      `INSERT INTO salon_services (
        salon_id, main_category, sub_category, title, description, 
        price, discount, special_days, available_start_time, 
        available_end_time, duration_minutes, image_url, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        request.salon.id,
        serviceData.main_category,
        serviceData.sub_category,
        serviceData.title,
        serviceData.description || null,
        serviceData.price,
        serviceData.discount,
        serviceData.special_days || null,
        serviceData.available_start_time || null,
        serviceData.available_end_time || null,
        serviceData.duration_minutes,
        serviceData.image_url || null,
        serviceData.status
      ]
    );

    // Get the newly created service
    const [newService] = await query(
      `SELECT * FROM salon_services WHERE id = ?`,
      [result.insertId]
    );

    return createResponse({
      success: true,
      message: 'Service created successfully',
      data: newService,
      status: 201
    });

  } catch (error) {
    console.error('Error creating salon service:', error);
    return createResponse({
      success: false,
      message: 'Failed to create salon service',
      status: 500,
      data: { error: error.message }
    });
  }
};

// PUT - Update an existing service for the authenticated salon
const updateServiceHandler = async (request) => {
  try {
    const formData = await request.formData();
    const id = formData.get('id');
    
    if (!id) {
      return createResponse({
        success: false,
        message: 'Service ID is required for update',
        status: 400
      });
    }

    // First verify the service belongs to the salon and get current image
    const [currentService] = await query(
      `SELECT image_url FROM salon_services WHERE id = ? AND salon_id = ?`,
      [id, request.salon.id]
    );
    
    if (!currentService) {
      return createResponse({
        success: false,
        message: 'Service not found or not authorized',
        status: 404
      });
    }

    // Extract text fields
    const updateData = {
      main_category: formData.get('main_category'),
      sub_category: formData.get('sub_category'),
      title: formData.get('title'),
      description: formData.get('description'),
      price: formData.get('price'),
      discount: formData.get('discount'),
      special_days: formData.get('special_days'),
      available_start_time: formData.get('available_start_time'),
      available_end_time: formData.get('available_end_time'),
      duration_minutes: formData.get('duration_minutes'),
      status: formData.get('status')
    };

    // Handle image upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      // Delete old image if it exists
      if (currentService.image_url) {
        await deleteOldImage(currentService.image_url, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      // Save new image
      updateData.image_url = await saveUploadedFile(imageFile, UPLOAD_DIR, UPLOAD_PATH_PREFIX);
    } else if (formData.get('remove_image') === 'true') {
      // Handle explicit image removal
      if (currentService.image_url) {
        await deleteOldImage(currentService.image_url, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
      }
      updateData.image_url = null;
    }

    // Build the update query
    const updateFields = [];
    const params = [];
    
    const allowedFields = [
      'main_category', 'sub_category', 'title', 'description', 'price', 
      'discount', 'special_days', 'available_start_time', 'available_end_time',
      'duration_minutes', 'image_url', 'status'
    ];
    
    for (const field of allowedFields) {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        updateFields.push(`${field} = ?`);
        params.push(updateData[field]);
      }
    }
    
    if (updateFields.length === 0) {
      return createResponse({
        success: false,
        message: 'No valid fields provided for update',
        status: 400
      });
    }
    
    params.push(id, request.salon.id);
    
    await query(
      `UPDATE salon_services SET ${updateFields.join(', ')} 
       WHERE id = ? AND salon_id = ?`,
      params
    );

    // Get the updated service
    const [updatedService] = await query(
      `SELECT * FROM salon_services WHERE id = ?`,
      [id]
    );

    return createResponse({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    });

  } catch (error) {
    console.error('Error updating salon service:', error);
    return createResponse({
      success: false,
      message: 'Failed to update salon service',
      status: 500,
      data: { error: error.message }
    });
  }
};

// DELETE - Remove a service for the authenticated salon
const deleteServiceHandler = async (request) => {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return createResponse({
        success: false,
        message: 'Service ID is required for deletion',
        status: 400
      });
    }

    // Verify the service belongs to the salon and get image URL
    const [service] = await query(
      `SELECT image_url FROM salon_services WHERE id = ? AND salon_id = ?`,
      [id, request.salon.id]
    );
    
    if (!service) {
      return createResponse({
        success: false,
        message: 'Service not found or not authorized',
        status: 404
      });
    }

    // Delete associated image if it exists
    if (service.image_url) {
      await deleteOldImage(service.image_url, UPLOAD_PATH_PREFIX, UPLOAD_DIR);
    }

    await query(
      `DELETE FROM salon_services WHERE id = ? AND salon_id = ?`,
      [id, request.salon.id]
    );

    return createResponse({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting salon service:', error);
    return createResponse({
      success: false,
      message: 'Failed to delete salon service',
      status: 500,
      data: { error: error.message }
    });
  }
};

// Status update handler
const updateStatusHandler = async (request) => {
  try {
    const { id, status } = await request.json();
    
    if (!id || !status) {
      return createResponse({
        success: false,
        message: 'Service ID and status are required',
        status: 400
      });
    }

    // Verify the service belongs to the salon
    const [service] = await query(
      `SELECT id FROM salon_services WHERE id = ? AND salon_id = ?`,
      [id, request.salon.id]
    );
    
    if (!service) {
      return createResponse({
        success: false,
        message: 'Service not found or not authorized',
        status: 404
      });
    }

    await query(
      `UPDATE salon_services SET status = ? WHERE id = ?`,
      [status, id]
    );

    return createResponse({
      success: true,
      message: 'Service status updated successfully'
    });

  } catch (error) {
    console.error('Error updating service status:', error);
    return createResponse({
      success: false,
      message: 'Failed to update service status',
      status: 500,
      data: { error: error.message }
    });
  }
};

// Export the handlers wrapped with salon authentication
export const GET = withSalonAuth(getServicesHandler);
export const POST = withSalonAuth(createServiceHandler);
export const PUT = withSalonAuth(updateServiceHandler);
export const PATCH = withSalonAuth(updateStatusHandler);
export const DELETE = withSalonAuth(deleteServiceHandler);