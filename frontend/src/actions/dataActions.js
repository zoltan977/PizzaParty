import { SET_DATA, SELECT_PIZZA, SELECT_TOPPING, CHECK_CART } from "./types";
import axios from "axios";

export const setData = () => async (dispatch) => {
  try {
    const response = await axios("/api/data");

    //setting product data in the state
    dispatch({ type: SET_DATA, payload: response.data });
    //checking cart data in case database items have been deleted
    //and deleting invalid items in cart
    dispatch({
      type: CHECK_CART,
      payload: {
        pizza: response.data.pizza.map((p) => p._id.toString()),
        topping: response.data.topping.map((p) => p._id.toString()),
      },
    });
  } catch (error) {
    console.log("getting pizza data error: ", error);
    dispatch({ type: SET_DATA, payload: { pizza: [], topping: [] } });
  }
};

export const selectPizza = (pizza) => {
  return { type: SELECT_PIZZA, payload: pizza };
};

export const selectTopping = (topping) => {
  return { type: SELECT_TOPPING, payload: topping };
};
