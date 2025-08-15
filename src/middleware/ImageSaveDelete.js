import fs from 'fs/promises';
import path from 'path';

// Ensure upload directory exists
export async function ensureUploadDir(UPLOAD_DIR) {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error('Error creating upload directory:', err);
  }
}

// Save uploaded file and return the public URL
export async function saveUploadedFile(file, UPLOAD_DIR, UPLOAD_PATH_PREFIX) {
  await ensureUploadDir();
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const fileBuffer = await file.arrayBuffer();
  await fs.writeFile(filePath, Buffer.from(fileBuffer));
  return `${UPLOAD_PATH_PREFIX}${fileName}`;
}

// Delete old image file if it exists
export async function deleteOldImage(imageUrl, UPLOAD_PATH_PREFIX, UPLOAD_DIR) {
  if (!imageUrl || !imageUrl.startsWith(UPLOAD_PATH_PREFIX)) return;
  
  try {
    const fileName = imageUrl.replace(UPLOAD_PATH_PREFIX, '');
    const filePath = path.join(UPLOAD_DIR, fileName);
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error deleting old image:', err);
  }
}
