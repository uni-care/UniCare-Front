// In-memory token storage (XSS-resistant, does not persist in localStorage)
let inMemoryToken: string | null = null;

export const getAuthToken = () => {
  return inMemoryToken;
};

export const setAuthToken = (token: string | null) => {
  inMemoryToken = token;
};

export const clearAuthToken = () => {
  inMemoryToken = null;
};
