// Client-side storage operations using localStorage and cookies
import Cookies from 'js-cookie';

// Set auth token in both localStorage and cookie (for client-side checks)
export const setAuthToken = (role, token) => {
  if (typeof window !== 'undefined') {
    // Store in localStorage
    localStorage.setItem(`${role}Token`, token);
    
    // Also set a non-httpOnly cookie for client-side checks
    // This helps with middleware and other client-side auth checks
    Cookies.set(`${role}token`, token, { 
      expires: 7, // 7 days
      sameSite: 'strict',
      path: '/'
    });
  }
};

// Get auth token (checks localStorage first, then cookie)
export const getAuthToken = (role) => {
  if (typeof window !== 'undefined') {
    // Try localStorage first
    const token = localStorage.getItem(`${role}Token`);
    if (token) return token;
    
    // Fallback to cookie
    return Cookies.get(`${role}token`) || '';
  }
  return '';
};

// Remove auth token for a specific role
export const removeAuthToken = (role) => {
  if (typeof window !== 'undefined') {
    // Remove from localStorage
    localStorage.removeItem(`${role}Token`);
    localStorage.removeItem(`${role}-token`);
    
    // Remove from cookies
    Cookies.remove(`${role}token`, { path: '/' });
  }
};

// Clear all auth tokens (for logout)
export const clearAllTokens = () => {
  if (typeof window !== 'undefined') {
    // Clear all localStorage items
    localStorage.removeItem('userToken');
    localStorage.removeItem('salonToken');
    localStorage.removeItem('user-token');
    localStorage.removeItem('salon-token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin-token');
    
    // Clear all auth cookies
    Cookies.remove('usertoken', { path: '/' });
    Cookies.remove('salonstoken', { path: '/' });
    Cookies.remove('admintoken', { path: '/' });
    Cookies.remove('next-auth.session-token', { path: '/' });
    Cookies.remove('next-auth.csrf-token', { path: '/' });
    Cookies.remove('next-auth.callback-url', { path: '/' });
  }
};

// Check if user is authenticated
export const isAuthenticated = (role) => {
  if (typeof window !== 'undefined') {
    return !!getAuthToken(role);
  }
  return false;
};