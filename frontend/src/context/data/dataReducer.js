import {SET_DATA, SELECT_PIZZA, SELECT_TOPPING} from '../types';

const dataReducer = (state, action) => {
    switch (action.type) {
        case SET_DATA:
            return {
                ...state,
                pizza: [...action.payload.pizza],
                topping: [...action.payload.topping],
                loading: false
            }

        case SELECT_PIZZA:
            return {
                ...state,
                selectedPizza: action.payload
            }
        
        case SELECT_TOPPING:
            return {
                ...state,
                selectedTopping: action.payload
            }
        
        default:
        
        return state
    }
}

export default dataReducer;