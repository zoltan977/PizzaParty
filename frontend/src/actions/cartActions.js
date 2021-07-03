import {SET_CART} from './types'; 
import moveToCart from './../utils/moveToCart';

export const setCart = (cart) => {
    return {
        type: SET_CART, 
        payload: cart
    };
};

export const modifyOrDeleteItem = (modifyOrDelete, id, category, newValue) => {
    if (localStorage) {

        let partyPizza = JSON.parse(localStorage.partyPizza)
            
        modifyOrDelete ?
            partyPizza[category][id] = newValue 
            :
            delete partyPizza[category][id]    
            
        localStorage.partyPizza = JSON.stringify(partyPizza)

        // setCart(partyPizza)
        return {
            type: SET_CART, 
            payload: partyPizza
        };
    }
}

export const putInCart = (node, container) => {
    if (localStorage) {

        let partyPizza = JSON.parse(localStorage.partyPizza)
            
        partyPizza[node.className][node.dataset.id] ? 
            partyPizza[node.className][node.dataset.id] = Number(partyPizza[node.className][node.dataset.id]) + 1
            :
            partyPizza[node.className][node.dataset.id] = 1

            
        localStorage.partyPizza = JSON.stringify(partyPizza)

        moveToCart(node, container)
        
        // setCart(partyPizza)
        return {
            type: SET_CART, 
            payload: partyPizza
        };

    }
}