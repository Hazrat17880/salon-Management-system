import { withUserAuth } from "@/lib/authUser";

// Helper function for consistent responses
const createResponse = ({ success, message, data = null, status = 200 }) => 
  new Response(JSON.stringify({ success, message, data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

// POST - Create a new appointment
export const POST = withUserAuth(async (request) => {
  try {
    const { id } = request.user;
    const { salon_id, services_id } = await request.json();

    if (!salon_id || !services_id) {
      return createResponse({
        success: false,
        message: 'Salon ID and Services ID are required',
        status: 400
      });
    }

    // Check if salon and service exist
    const [salon] = await query('SELECT id FROM salons WHERE id = ?', [salon_id]);
    const [service] = await query('SELECT id FROM salon_services WHERE id = ?', [services_id]);

    if (!salon || !service) {
      return createResponse({
        success: false,
        message: 'Salon or Service not found',
        status: 404
      });
    }

    const result = await query(
      'INSERT INTO appointment (salon_id, user_id, services_id) VALUES (?, ?, ?)',
      [salon_id, id, services_id]
    );

    return createResponse({
      success: true,
      message: 'Appointment created successfully',
      data: { 
        appointmentId: result.insertId
      }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return createResponse({
      success: false,
      message: 'Failed to create appointment',
      status: 500
    });
  }
});

// GET - Get a specific appointment
export const GET = withUserAuth(async (request) => {
  try {
    const {  id } = request.user;
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return createResponse({
        success: false,
        message: 'Appointment ID is required',
        status: 400
      });
    }

    const [appointment] = await query(
      `SELECT a.*, s.name as salon_name, ss.name as service_name 
       FROM appointment a
       JOIN salons s ON a.salon_id = s.id
       JOIN salon_services ss ON a.services_id = ss.id
       WHERE a.id = ? AND a.user_id = ?`,
      [appointmentId, id]
    );

    if (!appointment) {
      return createResponse({
        success: false,
        message: 'Appointment not found',
        status: 404
      });
    }

    return createResponse({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch appointment',
      status: 500
    });
  }
});

// DELETE - Cancel an appointment
export const DELETE = withUserAuth(async (request) => {
  try {
    const {id } = request.user;
    const { searchParams } = new URL(request.url);
    const appointmentId = searchParams.get('appointmentId');

    if (!appointmentId) {
      return createResponse({
        success: false,
        message: 'Appointment ID is required',
        status: 400
      });
    }

    // Verify the appointment belongs to the user
    const [appointment] = await query(
      'SELECT id FROM appointment WHERE id = ? AND user_id = ?',
      [appointmentId, id]
    );

    if (!appointment) {
      return createResponse({
        success: false,
        message: 'Appointment not found or not authorized',
        status: 404
      });
    }

    await query(
      'DELETE FROM appointment WHERE id = ?',
      [appointmentId]
    );

    return createResponse({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return createResponse({
      success: false,
      message: 'Failed to cancel appointment',
      status: 500
    });
  }
});

// GET - List all appointments for user
export const GET_ALL = withUserAuth(async (request) => {
  try {
    const { id } = request.user;

    const appointments = await query(`
      SELECT a.*, s.name as salon_name, ss.name as service_name 
      FROM appointment a
      JOIN salons s ON a.salon_id = s.id
      JOIN salon_services ss ON a.services_id = ss.id
      WHERE a.user_id = ?
      ORDER BY a.id DESC
    `, [id]);

    return createResponse({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return createResponse({
      success: false,
      message: 'Failed to fetch appointments',
      status: 500
    });
  }
});