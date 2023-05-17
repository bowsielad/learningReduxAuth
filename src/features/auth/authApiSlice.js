import { apiSlice } from "../../app/api/apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        const { user, pwd } = credentials;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          name: "loginUser",
          param: {
            username: user,
            password: pwd,
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
      onQueryStarted: (credentials) => {
        //console.log("Login credentials:", credentials);
      },
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
