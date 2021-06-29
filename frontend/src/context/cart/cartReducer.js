import {SET_CART} from './../types';

const cartReducer = (state, action) => {
    switch (action.type) {
        case SET_CART:
            return {
                pizza: {...action.payload.pizza},
                topping: {...action.payload.topping}
            }
    
        default:
            return state
    }
}

export default cartReducer;