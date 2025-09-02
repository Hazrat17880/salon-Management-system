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

// ================== GET Service by ID ==================
export async function GET(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return createResponse(
        { success: false, message: 'Service ID is required' },
        400
      );
    }

    // Fetch service details with salon information
    const service = await query(`
      SELECT 
        ss.id,
        ss.salon_id,
        s.salon_name,
        s.owner_name,
        s.email as salon_email,
        s.phone_number as salon_phone,
        s.street_info,
        s.city,
        s.state,
        s.country,
        s.postal_code,
        s.days,
        s.opening_hours,
        s.image as salon_image,
        s.description as salon_description,
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
        (SELECT COUNT(*) FROM review WHERE salon_id = s.id) as total_reviews,
        (SELECT COUNT(*) FROM favorite_salon WHERE salon_id = s.id) as total_favorites
      FROM salon_services ss
      INNER JOIN salons s ON ss.salon_id = s.id
      WHERE ss.id = ?
      AND ss.status = 'active'
      AND s.active = TRUE
      AND s.is_verified = TRUE
    `, [serviceId]);

    if (service.length === 0) {
      return createResponse(
        { success: false, message: 'Service not found' },
        404
      );
    }

    const serviceData = service[0];

    // Fetch related services from the same salon
    const relatedServices = await query(`
      SELECT 
        id,
        title,
        description,
        price,
        discount,
        ROUND(price - (price * discount / 100), 2) as final_price,
        image_url,
        main_category,
        sub_category,
        duration_minutes
      FROM salon_services
      WHERE salon_id = ?
      AND id != ?
      AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 4
    `, [serviceData.salon_id, serviceId]);

    // Fetch reviews for this service
    const reviews = await query(`
      SELECT 
        r.id,
        r.title,
        r.review,
        r.stars,
        r.created_at,
        u.full_name as user_name,
        u.image as user_image
      FROM review r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.salon_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [serviceData.salon_id]);

    // Calculate average rating for this service
    const serviceReviews = await query(`
      SELECT 
        AVG(stars) as service_avg_rating,
        COUNT(*) as service_total_reviews
      FROM review 
      WHERE salon_id = ?
    `, [serviceData.salon_id]);

    const responseData = {
      service: {
        id: serviceData.id,
        salon_id: serviceData.salon_id,
        salon_name: serviceData.salon_name,
        salon_image: serviceData.salon_image,
        salon_description: serviceData.salon_description,
        salon_contact: {
          email: serviceData.salon_email,
          phone: serviceData.salon_phone,
          address: `${serviceData.street_info}, ${serviceData.city}, ${serviceData.state} ${serviceData.postal_code}, ${serviceData.country}`
        },
        salon_hours: {
          days: serviceData.days,
          opening_hours: serviceData.opening_hours
        },
        main_category: serviceData.main_category,
        sub_category: serviceData.sub_category,
        title: serviceData.title,
        description: serviceData.description,
        price: serviceData.price,
        discount: serviceData.discount,
        final_price: serviceData.final_price,
        special_days: serviceData.special_days,
        available_times: {
          start: serviceData.available_start_time,
          end: serviceData.available_end_time
        },
        duration_minutes: serviceData.duration_minutes,
        image_url: serviceData.image_url,
        status: serviceData.status,
        rating: {
          average: serviceReviews[0]?.service_avg_rating || 0,
          total_reviews: serviceReviews[0]?.service_total_reviews || 0,
          salon_avg_rating: serviceData.avg_rating,
          salon_total_reviews: serviceData.total_reviews
        },
        created_at: serviceData.created_at,
        updated_at: serviceData.updated_at
      },
      related_services: relatedServices,
      reviews: reviews,
      salon_stats: {
        total_favorites: serviceData.total_favorites,
        avg_rating: serviceData.avg_rating,
        total_reviews: serviceData.total_reviews
      }
    };

    return createResponse({
      success: true,
      data: responseData
    });
  } catch (error) {
    return handleError(error, 'fetch service');
  }
}