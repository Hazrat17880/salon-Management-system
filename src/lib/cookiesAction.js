// Client-side storage operations using localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('adminToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('adminToken') || '';
};

export const removeAuthToken = () => {
  localStorage.removeItem('adminToken');
};