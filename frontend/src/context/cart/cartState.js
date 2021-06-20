import { useReducer } from 'react';
import CartContext from './cartContext';
import cartReducer from './cartReducer';
import { SET_CART } from './../types';
import useMoveToCart from './../../hooks/useMoveToCart';

const CartState = (props) => {

    if (localStorage) {
        if (!localStorage.partyPizza) {
            localStorage.partyPizza = JSON.stringify({
                pizza: {},
                topping: {}
            })
        }
    }

    const initialState = localStorage.partyPizza ? JSON.parse(localStorage.partyPizza) : {};

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const moveToCart = useMoveToCart();

    const setCart = (cart) => {
        dispatch({type: SET_CART, payload: cart});
    };

    const modifyOrDeleteItem = (modifyOrDelete, id, category, newValue) => {
        if (localStorage) {

            let partyPizza = JSON.parse(localStorage.partyPizza)
                
            modifyOrDelete ?
                partyPizza[category][id] = newValue 
                :
                delete partyPizza[category][id]    
                
            localStorage.partyPizza = JSON.stringify(partyPizza)

            setCart(partyPizza)
        }
    }

    const putInCart = (node, container) => {
        if (localStorage) {

            let partyPizza = JSON.parse(localStorage.partyPizza)
                
            partyPizza[node.className][node.dataset.id] ? 
                partyPizza[node.className][node.dataset.id] = partyPizza[node.className][node.dataset.id] + 1
                :
                partyPizza[node.className][node.dataset.id] = 1

                
            localStorage.partyPizza = JSON.stringify(partyPizza)

            setCart(partyPizza)

            moveToCart(node, container)
        }
    }

    return <CartContext.Provider
        value={
                {
                    cart: state,
                    setCart,
                    modifyOrDeleteItem,
                    putInCart
                }
            }>
            {props.children}
    </CartContext.Provider>
}

export default CartState;