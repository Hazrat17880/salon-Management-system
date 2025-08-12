import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/dbConnection';

export async function authSalons() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('salonstoken')?.value;

    if (!token) {
      return { 
        isAuthenticated: false, 
        message: 'No authentication token found' 
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has salon role
    if (decoded.role !== 'salon') {
      return { 
        isAuthenticated: false, 
        message: 'Invalid token role' 
      };
    }

    // Verify salon exists in database
    const [salon] = await query(
      'SELECT id, email, is_verified FROM salons WHERE id = ?',
      [decoded.id]
    );

    if (!salon) {
      return { 
        isAuthenticated: false, 
        message: 'Salon not found' 
      };
    }

    // Check if salon is verified
    if (!salon.is_verified) {
      return { 
        isAuthenticated: false, 
        message: 'Salon not verified' 
      };
    }

    return {
      isAuthenticated: true,
      salon: {
        id: salon.id,
        email: salon.email
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

// Higher-order function to protect salon routes
export function withSalonAuth(handler) {
  return async (request) => {
    const authResult = await authSalons();
    
    if (!authResult.isAuthenticated) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: authResult.message || 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add salon info to request object
    request.salon = authResult.salon;
    
    return handler(request);
  };
}