import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withUserAuth } from '@/lib/authUser';

// GET all reviews (for authenticated user)
export const GET = withUserAuth(async(req)=> {
  try {
    const userId= req.user.id
    // Get all reviews for the authenticated user
    const reviews = await query(`
      SELECT 
        r.id,
        r.title,
        r.review,
        r.stars,
        r.user_id,
        r.created_at,
        r.updated_at,
        u.full_name,
        u.email,
        u.image
      FROM review r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `, [userId]);

    return NextResponse.json({
      success: true,
      data: reviews,
      total: reviews.length,
      userid:userId
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
)
// POST - Create a new review
export const POST = withUserAuth(async(request)=> {
  try {
    // Verify user authentication
  
    const userId = request.user.id;
    const body = await request.json();
    const {salon_id, title, review, stars } = body;

    // Validate required fields
    if (!title || !review || stars === undefined || !salon_id) {
      return NextResponse.json(
        { success: false, message: 'Salon Id, Title, review, and stars are required' },
        { status: 400 }
      );
    }

    // Validate star rating (1-5)
    if (stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, message: 'Stars must be between 1 and 5' },
        { status: 400 }
      );
    }

    await query(`
      DELETE FROM review WHERE user_id = ? AND salon_id = ?`,[userId, salon_id])
    // Create new review
    const result = await query(
      'INSERT INTO review (title, review, stars, user_id, salon_id) VALUES (?, ?, ?, ?, ?)',
      [title, review, stars, userId, salon_id]
    );

    // Get the newly created review
    const newReview = await query(`
      SELECT 
        r.id,
        r.title,
        r.review,
        r.stars,
        r.user_id,
        r.created_at,
        r.updated_at,
        u.full_name,
        u.email
      FROM review r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [result.insertId]);

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      data: newReview[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
})

// PATCH - Update a review
export const PUT = withUserAuth(async(request)=> {
  try {
  
    const userId = request.user.id;
    const body = await request.json();
    const { salon_id, title, review, stars } = body;

    // Validate required fields
    if (!salon_id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Validate star rating if provided
    if (stars !== undefined && (stars < 1 || stars > 5)) {
      return NextResponse.json(
        { success: false, message: 'Stars must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to the user
    const existingReview = await query(
      'SELECT id FROM review WHERE salon_id = ? AND user_id = ?',
      [salon_id, userId]
    );

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Review not found or access denied' },
        { status: 404 }
      );
    }

    // Build update query dynamically based on provided fields
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }

    if (review !== undefined) {
      updateFields.push('review = ?');
      updateValues.push(review);
    }

    if (stars !== undefined) {
      updateFields.push('stars = ?');
      updateValues.push(stars);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

  

    // Update review
    await query(
      `UPDATE review SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE salon_id = ? AND user_id = ?`,
      [...updateValues, salon_id, userId]
    );

    // Get the updated review
    const updatedReview = await query(`
      SELECT 
        r.id,
        r.title,
        r.review,
        r.stars,
        r.user_id,
        r.created_at,
        r.updated_at,
        u.full_name,
        u.email
      FROM review r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [existingReview[0].id]);

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview[0]
    });

  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
})

// DELETE - Delete a review
export const DELETE = withUserAuth(async(request)=> {
  try {
   
    const userId = request.user.id;
     const { searchParams } = new URL(request.url);
     const  id = parseInt(searchParams.get('id'))
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to the user
    const existingReview = await query(
      'SELECT id FROM review WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existingReview.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Review not found or access denied' },
        { status: 404 }
      );
    }

    // Delete review
    await query(
      'DELETE FROM review WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
})