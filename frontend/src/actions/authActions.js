import { LOGIN_SUCCESS, LOGOUT, SET_USER } from "./types";

import axios from "axios";
import setAuthToken from "./../utils/setAuthToken";
import jwt_decode from "jwt-decode";

axios.defaults.baseURL = "http://localhost:8000";

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const setToken = (token) => {
  const user = jwt_decode(token).user;

  return {
    type: LOGIN_SUCCESS,
    payload: { token, user },
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

export const loadUser = () => async (dispatch) => {
  const token = localStorage.token;
  if (token) setAuthToken(token);

  try {
    const res = await axios.get("/api/loaduser");

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { token, user: res.data },
    });
  } catch (error) {
    console.log("auth actions load user error:", error);

    dispatch({
      type: LOGOUT,
    });
  }
};
