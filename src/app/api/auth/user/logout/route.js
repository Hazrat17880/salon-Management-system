import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Remove the cookie
  await  cookies().set('salonstoken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Logged out successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to logout' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}