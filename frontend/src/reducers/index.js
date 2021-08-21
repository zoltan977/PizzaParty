import { combineReducers } from "redux";
import authReducer from "./authReducer";
import cartReducer from "./cartReducer";
import dataReducer from "./dataReducer";

export default combineReducers({
  auth: authReducer,
  cart: cartReducer,
  data: dataReducer,
});
