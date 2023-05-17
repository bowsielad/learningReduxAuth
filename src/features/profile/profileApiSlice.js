import { apiSlice } from "../../app/api/apiSlice";

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          name: "handleProfileManager",
          param: {
            action: "read",
            id: id,
          },
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        return {
          url: "restapi-php/jwt-api/",
          ...requestOptions,
        };
      },
      keepUnusedDataFor: 5,
    }),
  }),
});

export const { useGetProfileQuery } = profileApiSlice;
