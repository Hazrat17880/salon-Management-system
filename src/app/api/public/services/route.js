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

// ================== GET Random Services ==================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 12;
    const category = searchParams.get('category');
    const salonId = searchParams.get('salon_id');
    
    // Build the base query
    let baseQuery = `
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
    `;
    
    // Add filters if provided
    const queryParams = [];
    
    if (category) {
      baseQuery += ` AND ss.main_category = ?`;
      queryParams.push(category);
    }
    
    if (salonId) {
      baseQuery += ` AND ss.salon_id = ?`;
      queryParams.push(salonId);
    }
    
    // Add random ordering and limit
    baseQuery += ` ORDER BY RAND() LIMIT ?`;
    queryParams.push(limit);
    
    // Execute the query
    const services = await query(baseQuery, queryParams);
    
    if (services.length === 0) {
      return createResponse(
        { 
          success: true, 
          message: 'No services found',
          data: {
            services: [],
            pagination: {
              total: 0,
              limit: limit,
              has_more: false
            }
          }
        },
        200
      );
    }
    
    // Get total count for pagination info (without limit)
    let countQuery = `
      SELECT COUNT(*) as total_count
      FROM salon_services ss
      INNER JOIN salons s ON ss.salon_id = s.id
      WHERE ss.status = 'active'
      AND s.active = TRUE
      AND s.is_verified = TRUE
    `;
    
    const countParams = [];
    
    if (category) {
      countQuery += ` AND ss.main_category = ?`;
      countParams.push(category);
    }
    
    if (salonId) {
      countQuery += ` AND ss.salon_id = ?`;
      countParams.push(salonId);
    }
    
    const totalCountResult = await query(countQuery, countParams);
    const totalCount = totalCountResult[0]?.total_count || 0;
    
    // Format the response
    const formattedServices = services.map(service => ({
      id: service.id,
      salon_id: service.salon_id,
      salon_name: service.salon_name,
      salon_image: service.salon_image,
      location: {
        street: service.street_info,
        city: service.city,
        state: service.state
      },
      main_category: service.main_category,
      sub_category: service.sub_category,
      title: service.title,
      description: service.description,
      price: service.price,
      discount: service.discount,
      final_price: service.final_price,
      special_days: service.special_days,
      available_times: {
        start: service.available_start_time,
        end: service.available_end_time
      },
      duration_minutes: service.duration_minutes,
      image_url: service.image_url,
      status: service.status,
      rating: {
        average: service.avg_rating || 0,
        total_reviews: service.total_reviews || 0
      },
      created_at: service.created_at,
      updated_at: service.updated_at
    }));
    
    return createResponse({
      success: true,
      data: {
        services: formattedServices,
        pagination: {
          total: totalCount,
          limit: limit,
          has_more: totalCount > limit
        }
      }
    });
    
  } catch (error) {
    return handleError(error, 'fetch random services');
  }
}