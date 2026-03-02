// src/app/api/salons/get-profile/route.js
"use server";

import { query } from "@/lib/dbConnection";

// Helper to format JSON responses
const createResponse = (success, message, data = null, status = 200) => {
  return new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
};

// GET API - no auth
export const GET = async (request) => {
  try {
    // Get email from cookie if available (optional)
    const cookie = request.headers.get('cookie') || '';
    const emailMatch = cookie.match(/salon_email=([^;]+)/);
    const salonEmail = emailMatch ? decodeURIComponent(emailMatch[1]) : null;

    if (!salonEmail) {
      return createResponse(false, "Salon not logged in", null, 401);
    }

    // Fetch salon profile from DB
    const [salon] = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description, image,
        is_verified, active, license, id_card,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at,
        DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
      FROM salons WHERE email = ?`,
      [salonEmail]
    );

    if (!salon) {
      return createResponse(false, "Salon not found", null, 404);
    }

    return createResponse(true, "Salon profile retrieved successfully", salon);
  } catch (error) {
    console.error("Error fetching salon profile:", error);
    return createResponse(false, "Failed to fetch salon profile", { error: error.message }, 500);
  }
};