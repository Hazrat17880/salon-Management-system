// Client-side storage operations using localStorage
export const setAuthToken = (name,token) => {
  localStorage.setItem(name, token);
};

export const getAuthToken = (name) => {
  return localStorage.getItem(name) || '';
};

export const removeAuthToken = () => {
  localStorage.clear();
};