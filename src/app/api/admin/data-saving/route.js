import { query } from "@/lib/dbConnection";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const email = process.env.ADMIN_EMAIL;
    const newPassword = process.env.ADMIN_PASSWORD;

    // Check if admin already exists
    const existing = await query(
      "SELECT * FROM admin_auth WHERE email = ?",
      [email]
    );

    // CASE 1: Admin does NOT exist → Create new
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await query(
        "INSERT INTO admin_auth (email, password_hash) VALUES (?, ?)",
        [email, hashedPassword]
      );
      return Response.json({ 
        message: "Admin created successfully",
        action: "created"
      });
    }

    // CASE 2: Admin exists → Check if password needs update
    const existingAdmin = existing[0];
    const currentHashedPassword = existingAdmin.password_hash;
    
    // Compare new password with existing hashed password
    const isSamePassword = await bcrypt.compare(newPassword, currentHashedPassword);
    
    if (isSamePassword) {
      // Password is the same → No update needed
      return Response.json({ 
        message: "Admin already exists with same password. No update needed.",
        action: "no_change"
      });
    } else {
      // Password is different → Update the password
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await query(
        "UPDATE admin_auth SET password_hash = ? WHERE email = ?",
        [newHashedPassword, email]
      );
      return Response.json({ 
        message: "Admin password updated successfully",
        action: "updated"
      });
    }
    
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}