import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./constants.js";

// Tags pour le cache de l'API principale (à adapter selon vos besoins)
const tagTypes = ["User", "Article"];

// Configuration de la requête de base pour l'API principale
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});


// API principale pour les produits, utilisateurs, etc.
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes,
  endpoints: (builder) => ({}), // Endpoints spécifiques à l'API principale
});

