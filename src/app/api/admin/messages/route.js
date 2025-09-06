import { NextResponse } from 'next/server';
import { query } from '@/lib/dbConnection';
import { withAdminAuth } from '@/lib/authAdmin';

// GET all messages with filters
export const GET = withAdminAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build WHERE clause based on filters
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR email LIKE ? OR message LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (status !== 'all') {
      whereClause += ' AND is_viewed = ?';
      params.push(status === 'read' ? 1 : 0);
    }

    // Get messages with filters
    const messages = await query(`
      SELECT 
        id,
        name,
        email,
        message,
        is_viewed,
        viewed_at,
        created_at,
        updated_at
      FROM contact_messages 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    // Get total count for pagination
    const totalResult = await query(`
      SELECT COUNT(*) as total 
      FROM contact_messages 
      ${whereClause}
    `, params);

    const total = totalResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    // Get unread count for badge
    const unreadResult = await query(`
      SELECT COUNT(*) as unread_count 
      FROM contact_messages 
      WHERE is_viewed = FALSE
    `);

    const unreadCount = unreadResult[0]?.unread_count || 0;

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limit,
          has_next: page < totalPages,
          has_prev: page > 1
        },
        stats: {
          total_messages: total,
          unread_count: unreadCount,
          read_count: total - unreadCount
        }
      }
    });

  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PATCH - Mark single message as read/unread
export const PATCH = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    console.log('PATCH request body:', body);
    
    const { messageId, is_viewed } = body;

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    if (is_viewed === undefined) {
      return NextResponse.json(
        { success: false, message: 'View status is required' },
        { status: 400 }
      );
    }

    // Update message view status
    if (is_viewed) {
      await query(`
        UPDATE contact_messages 
        SET is_viewed = TRUE, viewed_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `, [messageId]);
    } else {
      await query(`
        UPDATE contact_messages 
        SET is_viewed = FALSE, viewed_at = NULL 
        WHERE id = ?
      `, [messageId]);
    }

    return NextResponse.json({
      success: true,
      message: `Message marked as ${is_viewed ? 'read' : 'unread'} successfully`
    });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// PUT - Mark multiple messages as read/unread (bulk operation)
export const PUT = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    console.log('PUT request body:', body);
    
    const { messageIds, markAs } = body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message IDs array is required' },
        { status: 400 }
      );
    }

    if (!markAs || (markAs !== 'read' && markAs !== 'unread')) {
      return NextResponse.json(
        { success: false, message: 'MarkAs must be "read" or "unread"' },
        { status: 400 }
      );
    }

    // Validate message IDs are numbers
    const validMessageIds = messageIds.filter(id => !isNaN(parseInt(id)));
    if (validMessageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid message IDs are required' },
        { status: 400 }
      );
    }

    // Create placeholders for the query
    const placeholders = validMessageIds.map(() => '?').join(',');

    if (markAs === 'read') {
      await query(`
        UPDATE contact_messages 
        SET is_viewed = TRUE, viewed_at = CURRENT_TIMESTAMP 
        WHERE id IN (${placeholders})
      `, validMessageIds);
    } else {
      await query(`
        UPDATE contact_messages 
        SET is_viewed = FALSE, viewed_at = NULL 
        WHERE id IN (${placeholders})
      `, validMessageIds);
    }

    return NextResponse.json({
      success: true,
      message: `${validMessageIds.length} messages marked as ${markAs} successfully`
    });

  } catch (error) {
    console.error('Error updating multiple messages:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});
// DELETE - Delete a single message (using URL parameter)
export const DELETE = withAdminAuth(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json(
        { success: false, message: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Validate message ID is a number
    if (isNaN(parseInt(messageId))) {
      return NextResponse.json(
        { success: false, message: 'Valid message ID is required' },
        { status: 400 }
      );
    }

    // Check if message exists
    const message = await query('SELECT id FROM contact_messages WHERE id = ?', [messageId]);
    
    if (message.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 }
      );
    }

    // Delete message
    await query('DELETE FROM contact_messages WHERE id = ?', [messageId]);

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

// POST - Delete multiple messages (bulk operation with request body)
export const POST = withAdminAuth(async (request) => {
  try {
    const body = await request.json();
    console.log('POST request body:', body);
    
    const { messageIds, action } = body;

    // Check if this is a delete action
    if (action !== 'delete') {
      return NextResponse.json(
        { success: false, message: 'Invalid action' },
        { status: 400 }
      );
    }

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Message IDs array is required' },
        { status: 400 }
      );
    }

    // Validate message IDs are numbers
    const validMessageIds = messageIds.filter(id => !isNaN(parseInt(id)));
    if (validMessageIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid message IDs are required' },
        { status: 400 }
      );
    }

    // Create placeholders for the query
    const placeholders = validMessageIds.map(() => '?').join(',');

    // Delete multiple messages
    await query(`DELETE FROM contact_messages WHERE id IN (${placeholders})`, validMessageIds);

    return NextResponse.json({
      success: true,
      message: `${validMessageIds.length} messages deleted successfully`
    });

  } catch (error) {
    console.error('Error deleting multiple messages:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
});

