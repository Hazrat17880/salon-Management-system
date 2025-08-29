import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/dbConnection';

export async function authAdmin() {
  try {
    // Get token from cookies
    const cookieStore = cookies();
    const token = await cookieStore.get('adminToken')?.value;

    if (!token) {
      return { 
        isAuthenticated: false, 
        message: 'No authentication token found' 
      };
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has admin role
    if (decoded.role !== 'admin') {
      return { 
        isAuthenticated: false, 
        message: 'Invalid token role' 
      };
    }

    // Verify salon exists in database
    const [admin] = await query(
      'SELECT id, email, is_verified FROM admin_auth WHERE id = ?',
      [decoded.id]
    );

    if (!admin) {
      return { 
        isAuthenticated: false, 
        message: 'admin not found' 
      };
    }

    // Check if salon is verified
    // if (!salon.is_verified) {
    //   return { 
    //     isAuthenticated: false, 
    //     message: 'Salon not verified' 
    //   };
    // }

    return {
      isAuthenticated: true,
      admin: {
        id: admin.id,
        email: admin.email
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
export function withAdminAuth(handler) {
  return async (request) => {
    const authResult = await authAdmin();
    
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
    request.admin = authResult.admin;
    
    return handler(request);
  };
}