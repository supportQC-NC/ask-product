import { apiSlice } from "./apiSlice";
import { FOURNISSEURS_URL } from "./constants.js";

export const fournisseurApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all fournisseurs with pagination and filters
    getFournisseurs: builder.query({
      query: ({
        page = 1,
        limit = 20,
        sort = "createdAt",
        order = "desc",
        search = "",
        filter = "",
      } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
          order,
        });

        if (search) params.append("search", search);
        if (filter) params.append("filter", JSON.stringify(filter));

        return {
          url: `${FOURNISSEURS_URL}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["Fournisseur"],
      keepUnusedDataFor: 5,
    }),

    // Get a fournisseur by ID
    getFournisseurById: builder.query({
      query: (id) => ({
        url: `${FOURNISSEURS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Fournisseur", id }],
      keepUnusedDataFor: 5,
    }),

    // Get fournisseurs by FOURN
    getFournisseursByFourn: builder.query({
      query: (fournId) => ({
        url: `${FOURNISSEURS_URL}/fourn/${fournId}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Fournisseur"],
      keepUnusedDataFor: 5,
    }),

    // Get fournisseur by NOM
    getFournisseurByNom: builder.query({
      query: (nom) => ({
        url: `${FOURNISSEURS_URL}/nom/${nom}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Fournisseur"],
      keepUnusedDataFor: 5,
    }),

    // Create a new fournisseur
    createFournisseur: builder.mutation({
      query: (data) => ({
        url: `${FOURNISSEURS_URL}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Fournisseur"],
    }),

    // Update a fournisseur
    updateFournisseur: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${FOURNISSEURS_URL}/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Fournisseur", id }],
    }),

    // Delete a fournisseur
    deleteFournisseur: builder.mutation({
      query: (id) => ({
        url: `${FOURNISSEURS_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Fournisseur"],
    }),
  }),
});

export const {
  useGetFournisseursQuery,
  useGetFournisseurByIdQuery,
  useGetFournisseursByFournQuery,
  useGetFournisseurByNomQuery,
  useCreateFournisseurMutation,
  useUpdateFournisseurMutation,
  useDeleteFournisseurMutation,
} = fournisseurApiSlice;
