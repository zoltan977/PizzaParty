import { SET_CART, CHECK_CART } from "./../actions/types";

const initialState = () => {
  if (localStorage) {
    if (!localStorage.partyPizza) {
      localStorage.partyPizza = JSON.stringify({
        pizza: {},
        topping: {},
      });
    }
  }

  return localStorage.partyPizza ? JSON.parse(localStorage.partyPizza) : {};
};

const cartReducer = (state = initialState(), action) => {
  switch (action.type) {
    case SET_CART:
      return {
        pizza: { ...action.payload.pizza },
        topping: { ...action.payload.topping },
      };

    case CHECK_CART:
      const pizza = { ...state.pizza };
      const topping = { ...state.topping };
      for (const pizzaId in pizza) {
        if (!action.payload.pizza.includes(pizzaId.toString()))
          delete pizza[pizzaId];
      }
      for (const toppingId in topping) {
        if (!action.payload.topping.includes(toppingId.toString()))
          delete topping[toppingId];
      }
      localStorage.partyPizza = JSON.stringify({
        pizza,
        topping,
      });
      return {
        ...state,
        pizza,
        topping,
      };

    default:
      return state;
  }
};

export default cartReducer;
