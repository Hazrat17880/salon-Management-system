import { withUserAuth } from '@/lib/authUser';
import { query } from '@/lib/dbConnection';

// Helper function for consistent responses
const createResponse = ({ success, message, data = null, status = 200 }) => 
  new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// GET - Get paginated list of salons
const getSalons= withUserAuth(async(request)=> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    // Get total count of salons
    const [totalCount] = await query(
      'SELECT COUNT(*) as count FROM salons WHERE active = TRUE AND is_verified = TRUE'
    );

    // Get paginated salons
    const salons = await query(
      `SELECT 
        id, salon_name, owner_name, email, phone_number,
        street_info, city, state, country, postal_code,
        days, opening_hours, description,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at
       FROM salons 
       WHERE active = TRUE AND is_verified = TRUE
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return createResponse({
      success: true,
      message: 'Salons fetched successfully',
      data: {
        salons,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount.count / limit),
          totalSalons: totalCount.count,
          salonsPerPage: limit
        }
      }
    });

  } catch (error) {
    return createResponse({
      success: false,
      message: 'Failed to fetch salons',
      status: 500,
      data: { error: error.message }
    });
  }
})
export const GET  = getSalons;
