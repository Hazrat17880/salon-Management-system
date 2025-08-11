import { verifyToken } from '../lib/auth';
import { cookies } from 'next/headers'; // for reading cookies in Next.js App Router (server handlers)

// Auth middleware
const isAuthenticated = () => {
  const token = cookies().get('adminToken')?.value;
  if (!token) return null;
  
  try {
    const userId = verifyToken(token); // Returns user ID or throws
    return userId;
  } catch (err) {
    return null;
  }
};
export default isAuthenticated