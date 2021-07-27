import {
  CONFIRM_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CONFIRM_FAIL,
  CLEAR_ERRORS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  RESET_CONFIRM_SUCCESS,
  SET_WAITING_FOR_SERVER_RESPONSE,
} from "./types";

import axios from "axios";
import setAuthToken from "./../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

export const resetRegistrationSuccess = (_) => {
  return {
    type: REGISTER_SUCCESS,
    payload: false,
  };
};

export const resetConfirmationSuccess = (_) => {
  return {
    type: RESET_CONFIRM_SUCCESS,
  };
};

export const confirm = (code, email) => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_ERRORS,
    });

    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: true,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post(
      "/api/confirm",
      {
        email,
        code,
      },
      config
    );

    console.log("confirm action res.data: ", res.data);

    dispatch({
      type: CONFIRM_SUCCESS,
      payload: res.data,
    });

    const user = jwt_decode(res.data.token).user;

    console.log("confirm action user: ", user);

    dispatch({
      type: USER_LOADED,
      payload: user,
    });
  } catch (error) {
    console.log("confirm action error.response.data: ", error.response.data);

    dispatch({
      type: CONFIRM_FAIL,
      payload: error.response.data,
    });
  } finally {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: false,
    });
  }
};

export const register = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: true,
    });

    dispatch({
      type: CLEAR_ERRORS,
    });
    const res = await axios.post("/api/register", formData, config);

    console.log("register action res.data: ", res.data);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: true,
    });
  } catch (error) {
    console.log(error.response.data);

    dispatch({
      type: REGISTER_FAIL,
      payload: error.response.data,
    });
  } finally {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: false,
    });
  }
};

export const google = (code) => async (dispatch) => {
  console.log("google action code:", code);
  try {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: true,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/google", { code }, config);

    console.log("google action /api/google res.data", res.data);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    const user = jwt_decode(res.data.token).user;

    console.log("google action user: ", user);

    dispatch({
      type: USER_LOADED,
      payload: user,
    });
  } catch (error) {
    console.log(error.response.data);

    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data,
    });
  } finally {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: false,
    });
  }
};

export const login = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: true,
    });

    dispatch({
      type: CLEAR_ERRORS,
    });
    const res = await axios.post("/api/login", formData, config);
    console.log(res.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    const user = jwt_decode(res.data.token).user;

    console.log("login action user: ", user);

    dispatch({
      type: USER_LOADED,
      payload: user,
    });
  } catch (error) {
    console.log(error.response.data);

    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data,
    });
  } finally {
    dispatch({
      type: SET_WAITING_FOR_SERVER_RESPONSE,
      payload: false,
    });
  }
};

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);

  try {
    const res = await axios.get("/api/loaduser");

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    console.log("auth actions load user error:", error.response.data);

    dispatch({
      type: AUTH_ERROR,
    });
  }
};
