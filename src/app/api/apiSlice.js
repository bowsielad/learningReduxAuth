import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logOut } from "../../features/auth/authSlice";

const restBaseUrl = process.env.REACT_APP_REST_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: restBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.data?.response?.status === 302) {
    // send refresh token to get new access token
    const token = api.getState().auth.token; // 1 minute

    console.log("token:", token);

    var raw = JSON.stringify({
      name: "refreshTokenRedux",
      param: {
        token: token,
      },
    });

    const refreshResult = await baseQuery(
      {
        url: "restapi-php/jwt-api/",
        method: "POST",
        body: raw,
      },
      api,
      extraOptions
    );

    //console.log(refreshResult);
    const refreshToken = refreshResult?.data?.response?.result?.token;

    if (refreshToken) {
      const user = api.getState().auth.user;
      // store the new token
      api.dispatch(setCredentials({ token: refreshToken })); // 1 hour
      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
