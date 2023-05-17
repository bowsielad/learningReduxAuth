import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const restBaseUrl = process.env.REACT_APP_REST_BASE_URL;

export const refreshAsyncAuth = createAsyncThunk(
  "auth/refreshAsyncAuth",
  async (freshToken, { rejectWithValue }) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //console.log("oldToken: ", freshToken);

    var raw = JSON.stringify({
      name: "refreshTokenRedux",
      param: {
        token: freshToken,
      },
    });

    try {
      const response = await fetch(`${restBaseUrl}restapi-php/jwt-api/`, {
        method: "POST",
        headers: myHeaders,
        body: raw,
      });
      const data = await response.json();

      const status = data.response.status;

      if (status == 200) {
        const sameToken = data.response?.result?.token;
        return sameToken;
      }
      console.log("status:", status);
      console.log("messege:", data.response.result);

      return rejectWithValue(data.response.result);
    } catch (err) {
      console.log("err: ", err);
    }
  }
);

function isRejectedAction(action) {
  //console.log("rejected: ", action.payload);
  return action.type.endsWith("rejected");
}

const authSlice = createSlice({
  name: "auth",
  initialState: { userName: null, userId: null, userRole: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const { token } = action.payload;

      const userData = jwtDecode(token);

      //localStorage.setItem("userId", userData.user.id);

      state.userName = userData.user.username;
      state.userId = userData.user.id;
      state.userRole = userData.roles.role;
      state.token = token;
    },
    logOut: (state, action) => {
      state.userName = null;
      state.userId = null;
      state.userRole = null;
      state.token = null;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshAsyncAuth.pending, (state, action) => {
        //console.log("Pending");
      })
      // You can chain calls, or have separate `builder.addCase()` lines each time
      .addCase(refreshAsyncAuth.fulfilled, (state, action) => {
        //console.log("Fetched Successfully!", { action });

        const token = action.payload;

        const userData = jwtDecode(token);

        state.userName = userData.user.username;
        state.userId = userData.user.id;
        state.userRole = userData.roles.role;
        state.token = token;
      })
      .addCase(refreshAsyncAuth.rejected, (state, action) => {
        console.log("add case rejected", { action });
      })
      // You can match a range of action types
      .addMatcher(
        isRejectedAction,
        // `action` will be inferred as a RejectedAction due to isRejectedAction being defined as a type guard
        (state, action) => {
          console.log("Rejected!");
          console.log("Rejected!: ", action.payload);
        }
      )
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => {
        //console.log("other default case");
      });
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentuserName = (state) => state.auth.userName;
export const selectCurrentUserId = (state) => state.auth.userId;
export const selectCurrentUserRole = (state) => state.auth.userRole;
export const selectCurrentToken = (state) => state.auth.token;
