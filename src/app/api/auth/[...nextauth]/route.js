import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/dbConnection";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const [user] = await query(
            `SELECT id, email, password_hash, is_verified, active, full_name FROM users WHERE email = ?`,
            [credentials.email]
          );

          if (!user) {
            throw new Error("Invalid credentials");
          }

          if (!user.is_verified) {
            throw new Error("Please verify your email first");
          }

          if (!user.active) {
            throw new Error("Account is not active");
          }

          const isMatch = await bcrypt.compare(credentials.password, user.password_hash);
          if (!isMatch) {
            throw new Error("Invalid credentials");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      }
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  pages: {
    signIn: "/user/signin",
    error: "/user/signin",
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google" || account.provider === "facebook") {
        try {
          // Check if user exists by email
          const [existingUser] = await query(
            "SELECT id FROM users WHERE email = ?",
            [user.email]
          );

          if (!existingUser) {
            // Create new user for OAuth login with provider info
            await query(
              `INSERT INTO users (full_name, email, image, password_hash, is_verified, active, provider, provider_id) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                user.name || profile.name || user.email.split("@")[0],
                user.email,
                user.image || profile.picture || "",
                "",
                true,
                true,
                account.provider,
                user.id // This is the OAuth provider ID (Google/Facebook ID)
              ]
            );
          } else {
            // Update existing user with provider info if not already set
            await query(
              `UPDATE users 
               SET provider = ?, provider_id = ?, image = ? 
               WHERE email = ? AND (provider IS NULL OR provider = 'credentials')`,
              [
                account.provider,
                user.id,
                user.image || profile.picture || "",
                user.email
              ]
            );
          }
        } catch (error) {
          console.error("Error saving OAuth user:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.provider = account?.provider;
        token.providerId = user.id; // Store OAuth ID
      }

      // For OAuth logins, fetch user from database if not in token
      if (account && !token.databaseId) {
        try {
          const [dbUser] = await query(
            "SELECT id FROM users WHERE email = ?",
            [token.email || user?.email]
          );
          if (dbUser) {
            token.databaseId = dbUser.id;
            token.id = dbUser.id; // Set the numeric database ID as the main ID
          }
        } catch (error) {
          console.error("Error fetching user in jwt callback:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        // Set both the database ID and the OAuth ID in the session
        session.user.id = token.databaseId || token.id; // Use database ID if available
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.provider = token.provider;
        session.user.providerId = token.providerId; // Store OAuth ID separately
        
        // Add both IDs for flexibility
        session.user.databaseId = token.databaseId || token.id;
        session.user.oauthId = token.providerId;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return `${baseUrl}/user-dashboard`;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };