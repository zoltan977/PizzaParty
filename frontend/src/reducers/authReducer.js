import {
  LOGOUT,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  CONFIRM_SUCCESS,
  CONFIRM_FAIL,
  CLEAR_ERRORS,
  USER_LOADED,
  AUTH_ERROR,
  RESET_CONFIRM_SUCCESS,
  SET_WAITING_FOR_SERVER_RESPONSE,
} from "../actions/types";

import setAuthToken from "./../utils/setAuthToken";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  error: null,
  user: null,
  registration_success: false,
  confirmation_success: false,
  waitingForServerResponse: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WAITING_FOR_SERVER_RESPONSE:
      return {
        ...state,
        waitingForServerResponse: action.payload,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        registration_success: action.payload,
      };

    case RESET_CONFIRM_SUCCESS:
      return {
        ...state,
        confirmation_success: false,
      };

    case CONFIRM_SUCCESS:
    case LOGIN_SUCCESS:
      console.log("auth reducer login success action payload:", action.payload);
      localStorage.setItem("token", action.payload.token);
      setAuthToken(localStorage.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        confirmation_success: true,
      };

    case CONFIRM_FAIL:
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case LOGOUT:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      setAuthToken();
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    case USER_LOADED:
      console.log("auth reducer user loaded action payload:", action.payload);
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
