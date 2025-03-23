export const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.robot-nc.com'
  : 'http://localhost:5000';
  

export const USERS_URL = `${BASE_URL}/users`;
export const ARTICLES_URL = `${BASE_URL}/articles`;


