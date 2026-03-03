import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {

    console.log("your api is calling in logout");
    // AWAIT the cookies() function
    const cookieStore = await cookies();

    if(!cookieStore){
      return NextResponse.json({
        message:"Your Cookies are not found or fetch here "
      })
    }
    
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
    console.log("the following cookies are clear:",cookiesToClear);
    // Clear each cookie by setting it with an expired date
    for (const cookieName of cookiesToClear) {
  try {
    cookieStore.set({
      name: cookieName,
      value: '',
      path: '/',
      httpOnly: true,  // crucial for HttpOnly cookies
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // expire immediately
    });
  } catch (cookieError) {
    console.log(`Error clearing cookie ${cookieName}:`, cookieError);
  }
}

    // Return success response with proper JSON
    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Return error response with proper JSON
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to logout',
      error: error.message 
    }, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

// Also handle GET requests
export async function GET() {
  return POST();
}