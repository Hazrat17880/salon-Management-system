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
    const { searchParams } = new URL(request.url);
    const servicesLimit = searchParams.get('servicesLimit') || 12;
    const slidersLimit = searchParams.get('slidersLimit') || 6;
    const salonsLimit = searchParams.get('salonsLimit') || 8;

    // Fetch active sliders
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
      WHERE is_active = TRUE
      ORDER BY created_at DESC
      LIMIT ?
    `, [parseInt(slidersLimit)]);

    // Fetch featured salons
    const salons = await query(`
      SELECT 
        s.id,
        s.salon_name,
        s.owner_name,
        s.email,
        s.phone_number,
        s.street_info,
        s.city,
        s.state,
        s.country,
        s.postal_code,
        s.days,
        s.opening_hours,
        s.image,
        s.description,
        s.is_verified,
        s.active,
        s.created_at,
        s.updated_at,
        (SELECT AVG(stars) FROM review WHERE salon_id = s.id) as avg_rating,
        (SELECT COUNT(*) FROM review WHERE salon_id = s.id) as total_reviews,
        (SELECT COUNT(*) FROM favorite_salon WHERE salon_id = s.id) as total_favorites
      FROM salons s
      WHERE s.active = TRUE
      AND s.is_verified = TRUE
      ORDER BY avg_rating DESC, total_favorites DESC
      LIMIT ?
    `, [parseInt(salonsLimit)]);

    // Fetch featured services
    const services = await query(`
      SELECT 
        ss.id,
        ss.salon_id,
        s.salon_name,
        s.image as salon_image,
        s.street_info,
        s.city,
        s.state,
        ss.main_category,
        ss.sub_category,
        ss.title,
        ss.description,
        ss.price,
        ss.discount,
        ss.special_days,
        ss.available_start_time,
        ss.available_end_time,
        ss.duration_minutes,
        ss.image_url,
        ss.status,
        ss.created_at,
        ss.updated_at,
        ROUND(ss.price - (ss.price * ss.discount / 100), 2) as final_price,
        (SELECT AVG(stars) FROM review WHERE salon_id = s.id) as avg_rating,
        (SELECT COUNT(*) FROM review WHERE salon_id = s.id) as total_reviews
      FROM salon_services ss
      INNER JOIN salons s ON ss.salon_id = s.id
      WHERE ss.status = 'active'
      AND s.active = TRUE
      AND s.is_verified = TRUE
      ORDER BY ss.created_at DESC, ss.discount DESC
      LIMIT ?
    `, [parseInt(servicesLimit)]);

    // Return in the exact format requested
    return createResponse({
      success: true,
      salons: salons,
      services: services,
      sliders: sliders,
      counts: {
        salons: salons.length,
        services: services.length,
        sliders: sliders.length
      }
    });
  } catch (error) {
    return handleError(error, 'fetch home data');
  }
}