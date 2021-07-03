import {SET_CART} from './../actions/types';


const initialState = () => {

    if (localStorage) {
        if (!localStorage.partyPizza) {
            localStorage.partyPizza = JSON.stringify({
                pizza: {},
                topping: {}
            })
        }
    }

    return localStorage.partyPizza ? JSON.parse(localStorage.partyPizza) : {};
};

const cartReducer = (state = initialState(), action) => {
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