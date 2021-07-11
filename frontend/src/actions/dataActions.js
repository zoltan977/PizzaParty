import {SET_DATA, SELECT_PIZZA, SELECT_TOPPING} from './types';
import axios from 'axios';

export const setData = _ => async dispatch => {

    try {
        const response = await axios("/api/data")

        dispatch({type: SET_DATA, payload: response.data});
            
    } catch (error) {
        dispatch({type: SET_DATA, payload: null});
    }
};

export const selectPizza = (pizza) => {
    return ({type: SELECT_PIZZA, payload: pizza});
};

export const selectTopping = (topping) => {
    return ({type: SELECT_TOPPING, payload: topping});
};
