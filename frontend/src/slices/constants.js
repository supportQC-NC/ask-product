export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.krysto.io"
    : "http://localhost:5000";

export const USERS_URL = `${BASE_URL}/users`;
export const ARTICLES_URL = `${BASE_URL}/api/articles`;
export const ZONES_URL = `${BASE_URL}/api/zones`;
