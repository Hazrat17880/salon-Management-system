import { withUserAuth } from '@/lib/authUser';
import { query } from '@/lib/dbConnection';

// Helper function for consistent responses
const createResponse = ({ success, message, data = null, status = 200 }) => 
  new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// POST - Add/Remove favorite
export const POST = withUserAuth(async (request) => {
  try {
    const { id } = request.user;
    const { salonId } = await request.json();

    if (!salonId) {
      return createResponse({
        success: false,
        message: 'Salon ID is required',
        status: 400
      });
    }

    // Check if already favorited
    const [existing] = await query(
      'SELECT id FROM favorite_salon WHERE user_id = ? AND salon_id = ?',
      [id, salonId]
    );

    if (existing) {
      // Remove from favorites
      await query(
        'DELETE FROM favorite_salon WHERE id = ?',
        [existing.id]
      );
      
      return createResponse({
        success: true,
        message: 'Salon removed from favorites',
        data: { isFavorite: false }
      });
    } else {
      // Add to favorites
      const result = await query(
        'INSERT INTO favorite_salon (user_id, salon_id) VALUES (?, ?)',
        [id, salonId]
      );

      return createResponse({
        success: true,
        message: 'Salon added to favorites',
        data: { 
          isFavorite: true,
          favoriteId: result.insertId
        }
      });
    }
  } catch (error) {
    console.error('Error toggling favorite salon:', error);
    return createResponse({
      success: false,
      message: 'Failed to update favorite status',
      status: 500
    });
  }
});

// GET - Check if salon is favorited
export const GET = withUserAuth(async (request, params) => {
  try {
    const { id } = request.user;
    const { searchParams } = params;
    const salonId = searchParams.get('salonId');

    if (!salonId) {
      return createResponse({
        success: false,
        message: 'Salon ID is required',
        status: 400
      });
    }

    const [favorite] = await query(
      'SELECT id FROM favorite_salon WHERE user_id = ? AND salon_id = ?',
      [id, salonId]
    );

    return createResponse({
      success: true,
      data: { 
        isFavorite: !!favorite,
        favoriteId: favorite?.id || null
      }
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return createResponse({
      success: false,
      message: 'Failed to check favorite status',
      status: 500
    });
  }
});

// GET - List all favorite salons for user
export const GET_ALL = withUserAuth(async (request) => {
  try {
    const { id } = request.user;

    const favorites = await query(`
      SELECT s.* FROM favorite_salon f
      JOIN salons s ON f.salon_id = s.id
      WHERE f.user_id = ?
      ORDER BY f.id DESC
    `, [id]);

    return createResponse({
      success: true,
      data: favorites
    });
  } catch (error) {
    console.error('Error fetching favorite salons:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch favorite salons',
      status: 500
    });
  }
});