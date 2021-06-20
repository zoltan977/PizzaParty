import { useReducer } from 'react';
import AuthContext from './authContext';
import authReducer from './authReducer';
import { REGISTER_SUCCESS, REGISTER_FAIL, CLEAR_ERRORS, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from './../types';
import axios from 'axios';
import setAuthToken from './../../utils/setAuthToken';

const AuthState = (props) => {

    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        error: null,
        user: null
    };

    const [state, dispatch] = useReducer(authReducer, initialState);

    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
                dispatch({
                    type: CLEAR_ERRORS
                })
                const res = await axios.post("http://localhost:8000/register", formData, config)
                console.log(res.data)
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: res.data
                })
                loadUser()
        } catch (error) {
            console.log(error.response.data)
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data
            })
        }
    }    

    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        try {
                dispatch({
                    type: CLEAR_ERRORS
                })
                const res = await axios.post("http://localhost:8000/login", formData, config)
                console.log(res.data)
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: res.data
                })
                loadUser()
        } catch (error) {
            console.log(error.response.data)
            dispatch({
                type: LOGIN_FAIL,
                payload: error.response.data
            })
        }
    }

    const logout = () => {
        dispatch({type: LOGOUT});
        setAuthToken();
    }

    const loadUser = async () => {
        
        if (localStorage.token)
            setAuthToken(localStorage.token)

        try {
            const res = await axios.get("http://localhost:8000/loaduser")

            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: AUTH_ERROR
            })
        }
    }

    return <AuthContext.Provider
        value={
                {
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                    loading: state.loading,
                    user: state.user,
                    error: state.error,
                    register,
                    login,
                    logout,
                    loadUser
                }
            }>
            {props.children}
    </AuthContext.Provider>
}

export default AuthState;