import { useReducer, useState } from 'react';
import DataContext from './dataContext';
import dataReducer from './dataReducer';
import { SET_DATA } from '../types';

const DataState = (props) => {

    const initialState = {topping: [], pizza: []};

    const [state, dispatch] = useReducer(dataReducer, initialState);

    const [loading, setLoading] = useState(false);

    const setData = (data) => {
        dispatch({type: SET_DATA, payload: data});
    };

    return <DataContext.Provider
        value={
                {
                    data: state,
                    setData,
                    loading,
                    setLoading
                }
            }>
            {props.children}
    </DataContext.Provider>
}

export default DataState;
