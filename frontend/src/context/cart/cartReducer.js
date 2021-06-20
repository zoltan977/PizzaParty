import {SET_CART} from './../types';

export default (state, action) => {
    switch (action.type) {
        case SET_CART:
            return action.payload
    
        default:
            return state
    }
}