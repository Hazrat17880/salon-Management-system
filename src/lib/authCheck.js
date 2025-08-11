import { getAuthCookie } from "./cookiesAction";


export const checkAuth = () => {
  try {
    const token = getAuthCookie();;
    
    if (!token) return false;
    
    
    return true
  } catch (error) {
    return false;
  }
};