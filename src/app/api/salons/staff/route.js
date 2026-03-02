import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withSalonAuth } from '@/lib/authSalon';
import fs from 'fs';
import path from 'path';

// Helper: Save file locally
async function saveFile(file, folder = 'uploads/staff') {
  const uploadDir = path.join(process.cwd(), 'public', folder);

  // Ensure folder exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.promises.writeFile(filePath, buffer);

  return `/${folder}/${fileName}`; // return relative path for serving
}

// ============================ GET all staff ============================
export const GET = withSalonAuth(async (request) => {
  try {
    const salonId = request.salon.id;

    if (!salonId) {
      return NextResponse.json({ success: false, message: 'Salon ID is required' }, { status: 400 });
    }

    const staff = await query(
      'SELECT * FROM staff WHERE salon_id = ? ORDER BY created_at DESC',
      [salonId]
    );

    return NextResponse.json({ success: true, data: staff, total: staff.length });

  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});

// ============================ POST - Create staff ============================
export const POST = withSalonAuth(async (request) => {
  try {
    const salon_id = request.salon.id;

    const formData = await request.formData();
    const name = formData.get('name');
    const position = formData.get('position');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const status = formData.get('status') || 'active';
    const imageFile = formData.get('image');

    if (!name || !salon_id) {
      return NextResponse.json(
        { success: false, message: 'Name and salon ID are required' },
        { status: 400 }
      );
    }

    let imagePath = null;
    if (imageFile && imageFile.name) {
      imagePath = await saveFile(imageFile);
    }

    const result = await query(
      'INSERT INTO staff (name, position, email, phone, bio, image, salon_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, position, email, phone, bio, imagePath, salon_id, status]
    );

    const newStaff = await query('SELECT * FROM staff WHERE id = ?', [result.insertId]);

    return NextResponse.json({
      success: true,
      message: 'Staff member created successfully',
      data: newStaff[0],
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});

// ============================ PATCH - Update staff ============================
export const PATCH = withSalonAuth(async (request) => {
  try {
    const formData = await request.formData();
    const id = formData.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Staff ID is required' }, { status: 400 });
    }

    const existingStaff = await query('SELECT * FROM staff WHERE id = ?', [id]);
    if (existingStaff.length === 0) {
      return NextResponse.json({ success: false, message: 'Staff member not found' }, { status: 404 });
    }

    const name = formData.get('name');
    const position = formData.get('position');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const bio = formData.get('bio');
    const status = formData.get('status');
    const imageFile = formData.get('image');

    const updateFields = [];
    const updateValues = [];

    if (name) { updateFields.push('name = ?'); updateValues.push(name); }
    if (position) { updateFields.push('position = ?'); updateValues.push(position); }
    if (email) { updateFields.push('email = ?'); updateValues.push(email); }
    if (phone) { updateFields.push('phone = ?'); updateValues.push(phone); }
    if (bio) { updateFields.push('bio = ?'); updateValues.push(bio); }
    if (status) { updateFields.push('status = ?'); updateValues.push(status); }

    if (imageFile && imageFile.name) {
      const imagePath = await saveFile(imageFile);
      updateFields.push('image = ?');
      updateValues.push(imagePath);

      // Delete old image
      if (existingStaff[0].image) {
        const oldPath = path.join(process.cwd(), 'public', existingStaff[0].image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
    }

    updateValues.push(id);
    await query(`UPDATE staff SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, updateValues);

    const updatedStaff = await query('SELECT * FROM staff WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'Staff updated', data: updatedStaff[0] });

  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
});

// ============================ DELETE - Delete staff ============================
export const DELETE = withSalonAuth(async (request) => {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const existingStaff = await query('SELECT * FROM staff WHERE id = ?', [id]);
    if (existingStaff.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Delete old image file
    if (existingStaff[0].image) {
      const oldPath = path.join(process.cwd(), 'public', existingStaff[0].image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await query('DELETE FROM staff WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});
