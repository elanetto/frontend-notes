// const API_BASE_URL = "https://frontend-notes-ecn4.onrender.com";
const API_BASE_URL = "http://localhost:3000";

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  REGISTER: `${API_BASE_URL}/register`,
  PROFILE: `${API_BASE_URL}/profile`,
  NOTES: `${API_BASE_URL}/notes`,
  USERS: `${API_BASE_URL}/users`,
  USER_BY_EMAIL: (email) => `${API_BASE_URL}/user?email=${email}`,
};
