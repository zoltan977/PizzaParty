import { useReducer } from 'react';
import DataContext from './dataContext';
import dataReducer from './dataReducer';
import { SET_DATA, SELECT_PIZZA, SELECT_TOPPING } from '../types';

const DataState = (props) => {

    const initialState = {topping: [], pizza: [], selectedPizza: null, selectedTopping: null, loading: true};

    const [state, dispatch] = useReducer(dataReducer, initialState);

    const setData = (data) => {
        dispatch({type: SET_DATA, payload: data});
    };

    const selectPizza = (pizza) => {
        dispatch({type: SELECT_PIZZA, payload: pizza});
    };

    const selectTopping = (topping) => {
        dispatch({type: SELECT_TOPPING, payload: topping});
    };

    return <DataContext.Provider
        value={
                {
                    data: state,
                    setData,
                    loading: state.loading,
                    selectPizza,
                    selectedPizza: state.selectedPizza,
                    selectTopping,
                    selectedTopping: state.selectedTopping
                }
            }>
            {props.children}
    </DataContext.Provider>
}

export default DataState;
