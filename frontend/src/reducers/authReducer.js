import { LOGOUT, LOGIN_SUCCESS, SET_USER } from "../actions/types";

import setAuthToken from "./../utils/setAuthToken";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: {
          name: action.payload.name,
          photo: action.payload.photo + "?time=" + Date.now(),
          email: action.payload.email,
        },
        loading: false,
      };

    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      setAuthToken(action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };

    case LOGOUT:
      localStorage.removeItem("token");
      setAuthToken();
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

export default authReducer;
