import {SET_DATA, SELECT_PIZZA, SELECT_TOPPING} from './types'

export const setData = (data) => {
    return ({type: SET_DATA, payload: data});
};

export const selectPizza = (pizza) => {
    return ({type: SELECT_PIZZA, payload: pizza});
};

export const selectTopping = (topping) => {
    return ({type: SELECT_TOPPING, payload: topping});
};
