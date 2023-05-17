import { useLocation, Navigate, Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentToken, logOut, refreshAsyncAuth } from "./authSlice";

const RequireAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const token = useSelector(selectCurrentToken);

  const [isLoading, setIsLoading] = useState(true);

  const checkLoggedIn = async () => {
    const persist = localStorage.getItem("persist");
    const freshToken = localStorage.getItem("token");

    if (freshToken && persist === "true") {
      const action = await dispatch(refreshAsyncAuth(freshToken));
      if (action.type === "auth/refreshAsyncAuth/fulfilled") {
        setIsLoading(false);
        console.log("Token refresh succeeded!:", action.payload);
      } else if (action.type === "auth/refreshAsyncAuth/rejected") {
        console.log("Token status:", action.payload);
        dispatch(logOut());
        localStorage.clear();
        setIsLoading(false);
      } else {
        console.log("Token refresh failed!");
        console.log("Error:", action.error.message);
      }
      //const postAction = await dispatch(refreshAsyncAuth(freshToken)).unwrap();
      //console.log("do something!!!", postAction);

      localStorage.removeItem("token");
    } else {
      console.log("logout");
      localStorage.clear();
      dispatch(logOut());
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isReload = localStorage.getItem("isReload");

    if (isReload === "true") {
      checkLoggedIn();
      //console.log("isReload1: ", isReload);
    } else {
      //console.log("isReload2: ", isReload);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("token", token);
      localStorage.setItem("isReload", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [token]);

  if (isLoading) {
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default RequireAuth;
