import { apiSlice } from "./apiSlice";
import { ZONES_URL } from "./constants.js";

export const zoneApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all zones with pagination and filters
    getZones: builder.query({
      query: ({
        page = 1,
        limit = 20,
        sort = "createdAt",
        order = "desc",
        search,
        filter,
      }) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort,
          order,
        });

        if (search) params.append("search", search);
        if (filter) params.append("filter", JSON.stringify(filter));

        return {
          url: `${ZONES_URL}?${params.toString()}`,
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: (result, error, arg) => {
        if (result) {
          return result?.map((zone) => ({ type: "Zone", id: zone._id }));
        }
        return ["Zone"];
      },
      keepUnusedDataFor: 5,
    }),

    // Get a zone by ID
    getZoneById: builder.query({
      query: (id) => ({
        url: `${ZONES_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: (result, error, id) => [{ type: "Zone", id }],
      keepUnusedDataFor: 5,
    }),

    // Create a new zone
    createZone: builder.mutation({
      query: (data) => ({
        url: ZONES_URL,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Zone"],
    }),

    // Import zones from CSV file
    importZonesFromCSV: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: `${ZONES_URL}/import`,
          method: "POST",
          body: formData,
          credentials: "include",
        };
      },
      invalidatesTags: ["Zone"],
    }),
  }),
});

export const {
  useGetZonesQuery,
  useGetZoneByIdQuery,
  useCreateZoneMutation,
  useImportZonesFromCSVMutation,
} = zoneApiSlice;
