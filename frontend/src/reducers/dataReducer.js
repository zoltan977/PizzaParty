import {SET_DATA, SELECT_PIZZA, SELECT_TOPPING} from '../actions/types';

const initialState = {data: {topping: [], pizza: []}, selectedPizza: null, selectedTopping: null, loading: true};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DATA:
            return {
                ...state,
                data: {
                    pizza: [...action.payload.pizza],
                    topping: [...action.payload.topping],
                },
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