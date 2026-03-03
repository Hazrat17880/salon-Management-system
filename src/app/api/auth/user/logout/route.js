import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get the cookies store - await is required in Next.js 15+
    const cookieStore = await cookies();
    
    // List of cookies to clear
    const cookiesToClear = [
      'salonstoken',
      'usertoken',
      'next-auth.session-token',
      'next-auth.csrf-token',
      'next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      'next-auth.state'
    ];
    
    // Delete each cookie (use delete method instead of set with empty value)
    for (const cookieName of cookiesToClear) {
      try {
        cookieStore.delete(cookieName);
      } catch (cookieError) {
        console.log(`Error deleting cookie ${cookieName}:`, cookieError);
      }
    }

    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Return error response
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to logout' 
    }, { 
      status: 500
    });
  }
}

// Also handle GET requests
export async function GET() {
  return POST();
}