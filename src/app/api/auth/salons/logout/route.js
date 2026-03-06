import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {

    console.log("Salon logout API called");

    const cookieStore = await cookies();

    if (!cookieStore) {
      return NextResponse.json({
        success: false,
        message: "Cookies not found"
      });
    }

    const cookiesToClear = [
  "salonstoken",
  "salontoken",
  "next-auth.session-token",
  "next-auth.csrf-token",
  "next-auth.callback-url",
  "next-auth.pkce.code_verifier",
  "next-auth.state"
];

    console.log("Clearing cookies:", cookiesToClear);

    for (const cookieName of cookiesToClear) {
      try {
        cookieStore.set({
  name: cookieName,
  value: "",
  path: "/",
  httpOnly: true,
  secure: false, // important for localhost
  sameSite: "strict",
  expires: new Date(0),
});
      } catch (cookieError) {
        console.log(`Error clearing ${cookieName}`, cookieError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Salon logged out successfully"
    });

  } catch (error) {

    console.error("Salon logout error:", error);

    return NextResponse.json({
      success: false,
      message: "Logout failed",
      error: error.message
    }, { status: 500 });

  }
}

export async function GET() {
  return POST();
}