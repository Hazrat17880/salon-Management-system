import { authAdmin } from '@/lib/authAdmin';
import { query } from '@/lib/dbConnection';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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

// File upload configuration
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'sliders');

// Ensure upload directory exists
const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Save uploaded file
const saveUploadedFile = async (fileBuffer, originalFilename) => {
  ensureUploadDir();
  
  const fileExtension = path.extname(originalFilename);
  const uniqueFilename = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(UPLOAD_DIR, uniqueFilename);
  
  fs.writeFileSync(filePath, fileBuffer);
  
  return `/uploads/sliders/${uniqueFilename}`;
};

// Delete file from storage
const deleteFile = (filePath) => {
  if (filePath && filePath.startsWith('/uploads/')) {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Parse form data
const parseFormData = async (request) => {
  const formData = await request.formData();
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      data[key] = value;
    } else {
      data[key] = value;
    }
  }
  
  return data;
};

// ================== GET ==================
export async function GET(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const sliders = await query(`
      SELECT 
        id,
        title,
        description,
        image,
        is_active,
        created_at,
        updated_at
      FROM sliders
      ORDER BY created_at DESC
    `);

    return createResponse({ success: true, data: sliders });
  } catch (error) {
    return handleError(error, 'fetch sliders');
  }
}

// ================== POST ==================
export async function POST(request) {
  try {
    // First authenticate the admin
    const authResult = await authAdmin(request);
    if (authResult instanceof Response) {
      return authResult; // Return the auth error response
    }

    const formData = await parseFormData(request);
    const { title, description, image: imageFile, is_active = 'true' } = formData;
    
    if (!title || !imageFile) {
      return createResponse(
        { success: false, message: 'Title and image are required' },
        400
      );
    }

    // Validate file
    if (!(imageFile instanceof File)) {
      return createResponse(
        { success: false, message: 'Invalid image file' },
        400
      );
    }

    

    

    // Read file buffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save the uploaded file
    const imagePath = await saveUploadedFile(buffer, imageFile.name);

    const result = await query(
      `INSERT INTO sliders (title, description, image, is_active)
       VALUES (?, ?, ?, ?)`,
      [title, description, imagePath, is_active === 'true']
    );

    const [newSlider] = await query('SELECT * FROM sliders WHERE id = ?', [result.insertId]);

    return createResponse({
      success: true,
      message: 'Slider created successfully',
      data: newSlider
    }, 201);
  } catch (error) {
    return handleError(error, 'create slider');
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
    const action = searchParams.get('action'); // 'status' or 'update'
    
    if (action === 'status') {
      // For status updates, we can use JSON since no file is involved
      return await updateSliderStatus(request);
    }
    
    // For updates with potential file upload, use FormData
    return await updateSliderDetails(request);
  } catch (error) {
    return handleError(error, 'update slider');
  }
}

async function updateSliderStatus(request) {
  try {
    const data = await request.json();
    const { sliderId, is_active } = data;
    
    if (!sliderId || typeof is_active !== 'boolean') {
      return createResponse(
        { success: false, message: 'Slider ID and active status are required' },
        400
      );
    }

    const [slider] = await query('SELECT id, title FROM sliders WHERE id = ?', [sliderId]);
    if (!slider) return createResponse({ success: false, message: 'Slider not found' }, 404);

    await query(
      'UPDATE sliders SET is_active = ? WHERE id = ?',
      [is_active, sliderId]
    );

    return createResponse({
      success: true,
      message: `Slider ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: { id: sliderId, is_active, title: slider.title }
    });
  } catch (error) {
    return handleError(error, 'update slider status');
  }
}

async function updateSliderDetails(request) {
  try {
    const formData = await parseFormData(request);
    const { sliderId, title, description, image: imageFile, is_active } = formData;

    if (!sliderId) {
      return createResponse({ success: false, message: 'Slider ID is required' }, 400);
    }

    const [slider] = await query('SELECT id, image FROM sliders WHERE id = ?', [sliderId]);
    if (!slider) return createResponse({ success: false, message: 'Slider not found' }, 404);

    // Build dynamic update query based on provided fields
    const updateFields = [];
    const updateValues = [];
    let newImagePath = null;

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (imageFile instanceof File) {
      // Validate file type
      


      // Read file buffer and save new image
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      newImagePath = await saveUploadedFile(buffer, imageFile.name);
      updateFields.push('image = ?');
      updateValues.push(newImagePath);
    }
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateValues.push(is_active === 'true');
    }

    if (updateFields.length === 0) {
      return createResponse({ success: false, message: 'No fields to update' }, 400);
    }

    updateValues.push(sliderId);

    await query(
      `UPDATE sliders SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Delete old image if a new one was uploaded
    if (newImagePath && slider.image) {
      deleteFile(slider.image);
    }

    const [updatedSlider] = await query('SELECT * FROM sliders WHERE id = ?', [sliderId]);

    return createResponse({
      success: true,
      message: 'Slider updated successfully',
      data: updatedSlider
    });
  } catch (error) {
    return handleError(error, 'update slider details');
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

    const data = await request.json();
    const { sliderId } = data;
    
    if (!sliderId) return createResponse({ success: false, message: 'Slider ID is required' }, 400);

    const [slider] = await query('SELECT id, title, image FROM sliders WHERE id = ?', [sliderId]);
    if (!slider) return createResponse({ success: false, message: 'Slider not found' }, 404);

    await query('DELETE FROM sliders WHERE id = ?', [sliderId]);

    // Delete associated image file
    if (slider.image) {
      deleteFile(slider.image);
    }

    return createResponse({
      success: true,
      message: 'Slider deleted successfully',
      data: { id: sliderId, title: slider.title }
    });
  } catch (error) {
    return handleError(error, 'delete slider');
  }
}