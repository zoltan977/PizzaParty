import { LOGOUT,
        LOGIN_FAIL,
        LOGIN_SUCCESS,
        REGISTER_SUCCESS,
        REGISTER_FAIL,
        CLEAR_ERRORS,
        USER_LOADED,
        AUTH_ERROR
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    error: null,
    user: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            console.log("auth reducer login success action payload:", action.payload)
            localStorage.setItem("token", action.payload.token)
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            }

        case REGISTER_FAIL:
        case LOGIN_FAIL:
        case LOGOUT:
        case AUTH_ERROR:
            localStorage.removeItem("token")
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        case USER_LOADED:
            console.log("auth reducer user loaded action payload:", action.payload)
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false
            }

        default:
            return state
    }
}

export default authReducer;