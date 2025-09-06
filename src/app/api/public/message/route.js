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

// ================== POST Contact Message ==================
export async function POST(request) {
  try {
    // Parse the request body
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return createResponse(
        { 
          success: false, 
          message: 'All fields are required: name, email, and message' 
        },
        400
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return createResponse(
        { 
          success: false, 
          message: 'Name must be at least 2 characters long' 
        },
        400
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return createResponse(
        { 
          success: false, 
          message: 'Please provide a valid email address' 
        },
        400
      );
    }

    // Validate message length
    if (message.trim().length < 10) {
      return createResponse(
        { 
          success: false, 
          message: 'Message must be at least 10 characters long' 
        },
        400
      );
    }

    if (message.trim().length > 2000) {
      return createResponse(
        { 
          success: false, 
          message: 'Message cannot exceed 2000 characters' 
        },
        400
      );
    }

    // Insert message into database
    const result = await query(
      `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`,
      [name.trim(), email.trim(), message.trim()]
    );

    // Return success response
    return createResponse({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      data: { 
        id: result.insertId,
        name: name.trim(),
        email: email.trim()
      }
    }, 201);

  } catch (error) {
    // Handle database errors
    if (error.code === 'ER_DUP_ENTRY') {
      return createResponse(
        { 
          success: false, 
          message: 'A message with this email already exists recently' 
        },
        409
      );
    }

    return handleError(error, 'send message');
  }
}

