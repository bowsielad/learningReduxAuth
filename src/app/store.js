import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authReducer from "../features/auth/authSlice";
import countReducer from "../features/counter/countSlice";

const appReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  count: countReducer,
  devTools: true,
});

const rootReducer = (state, action) => {
  if (action.type === "hydrate") {
    console.log("from rootReducer", action.payload);
    return appReducer(action.payload, action);
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

store.subscribe(async () => {
  const state = store.getState();
  //console.log(state);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(state);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    //const response = await fetch("/state", requestOptions);
    //const result = await response.json();
    //console.log(result);
  } catch (error) {
    console.error("Error process:", error);
  }
});
