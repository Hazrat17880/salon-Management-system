// Client-side storage operations using localStorage and cookies
import Cookies from 'js-cookie';

// Set auth token in both localStorage and cookie (for client-side checks)
export const setAuthToken = (role, token) => {

  console.log("your setAuthToken is called ");
  if (typeof window !== 'undefined') {
    // Store in localStorage
    localStorage.setItem(`${role}Token`, token);
    
    // Also set a non-httpOnly cookie for client-side checks
    Cookies.set(`${role}token`, token, { 
      expires: 7,
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
  console.log("Your RmovedAUTHtOEKN IS CALLED");
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${role}Token`);
    localStorage.removeItem(`${role}-token`);
    Cookies.remove(`${role}token`, { path: '/' });
  }
};

// Clear all auth tokens and user data
export const clearAllAuthData = () => {
  console.log("your clear all auth data are called");
  if (typeof window !== 'undefined') {
    // Clear all localStorage items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('Token') || key.includes('token') || key.includes('auth') || key.includes('user'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear all auth cookies
    Cookies.remove('usertoken', { path: '/' });
    Cookies.remove('salonstoken', { path: '/' });
    Cookies.remove('admintoken', { path: '/' });
    Cookies.remove('next-auth.session-token', { path: '/' });
    Cookies.remove('next-auth.csrf-token', { path: '/' });
    Cookies.remove('next-auth.callback-url', { path: '/' });
  }
};

// Clear all tokens (alias for backward compatibility)
export const clearAllTokens = clearAllAuthData;

// Check if user is authenticated
export const isAuthenticated = (role) => {
  if (typeof window !== 'undefined') {
    return !!getAuthToken(role);
  }
  return false;
};