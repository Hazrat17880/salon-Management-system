// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { query } from "@/lib/dbConnection";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/user/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const existingUser = await query(
          "SELECT * FROM users WHERE email = ?",
          [user.email]
        );

        console.log("🔑 Provider:", account.provider);
        console.log("👤 User Data:", user);

        if (existingUser.length === 0) {
          await query(
            `INSERT INTO users (full_name, email, image, password_hash, is_verified, active, phone_number) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              user.name,
              user.email,
              user.image,
              "",        // no password for OAuth
              true,      // verified
              true,      // active
              ""         // leave phone empty for now
            ]
          );
          console.log(`✅ New ${account.provider} user inserted:`, user.email);
        } else {
          console.log(`ℹ️ ${account.provider} user already exists:`, user.email);
        }
      } catch (err) {
        console.error("❌ Error saving OAuth user:", err);
        return false;
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },

    async redirect() {
      return "/user-dashboard"; 
    },
  },
});

export { handler as GET, handler as POST };
