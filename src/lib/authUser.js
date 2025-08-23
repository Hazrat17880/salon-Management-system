import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/dbConnection';

export async function authUsers() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('usertoken')?.value;

    if (!token) {
      return { 
        isAuthenticated: false, 
        message: 'No authentication token found' 
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Check if the token has user role
    if (decoded.role !== 'user') {
      return { 
        isAuthenticated: false, 
        message: 'Invalid token role' 
      };
    }

    // Verify user exists in database
    const [user] = await query(
      'SELECT id, email, is_verified, active FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return { 
        isAuthenticated: false, 
        message: 'User not found' 
      };
    }

    // Check if user is verified
    if (!user.is_verified) {

      return { 
        isAuthenticated: false, 
        message: 'User not verified' 
      };
    }

    // Check if user is active
    if (!user.active) {
      return { 
        isAuthenticated: false, 
        message: 'User account is not active' 
      };
    }

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email
      }
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { 
      isAuthenticated: false, 
      message: 'Invalid or expired token',
      error: error.message 
    };
  }
}

// Higher-order function to protect user routes
export function withUserAuth(handler) {
  return async (request) => {
    const authResult = await authUsers();
    
    if (!authResult.isAuthenticated) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: authResult.message || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add user info to request object
    request.user = authResult.user;
    
    return handler(request);
  };
}