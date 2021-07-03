import { 
    REGISTER_SUCCESS, 
    REGISTER_FAIL, 
    CLEAR_ERRORS, 
    USER_LOADED, 
    AUTH_ERROR, 
    LOGIN_SUCCESS, 
    LOGIN_FAIL, 
    LOGOUT 
} from './types';

import axios from 'axios';
import setAuthToken from './../utils/setAuthToken';


export const register = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
            dispatch({
                type: CLEAR_ERRORS
            })
            const res = await axios.post("/api/register", formData, config)
            console.log(res.data)
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
            loadUser()
    } catch (error) {
        console.log(error.response.data)
        setAuthToken();
        dispatch({
            type: REGISTER_FAIL,
            payload: error.response.data
        })
    }
}    

export const login = formData => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
            dispatch({
                type: CLEAR_ERRORS
            })
            const res = await axios.post("/api/login", formData, config)
            console.log(res.data)
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
            loadUser()
    } catch (error) {
        console.log(error.response.data)
        setAuthToken();
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data
        })
    }
}

export const logout = () => {
    setAuthToken();
    
    return {
        type: LOGOUT
    };
}

export const loadUser = () => async dispatch => {
    
    if (localStorage.token)
        setAuthToken(localStorage.token)

    try {
        const res = await axios.get("/api/loaduser")

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        setAuthToken();
        dispatch({
            type: AUTH_ERROR
        })
    }
}

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}