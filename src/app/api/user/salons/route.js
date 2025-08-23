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
    const id = await request.user.id;
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
  `SELECT *
   FROM salons
   WHERE active = 1 AND is_verified = 1
   ORDER BY created_at DESC
   LIMIT ? OFFSET ?`,
  [limit, offset]   // force integers
);
    const favorite = await query(
      'SELECT * FROM favorite_salon WHERE  user_id =?',[id]
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
        },
        favorite
      }
    });

  } catch (error) {
    console.log(error);
    return createResponse({
      success: false,
      message: 'Failed to fetch salons',
      status: 500,
      data: { error: error.message }
    });
  }
})
export const GET  = getSalons;
