const User = require("../models/User");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");

const checkingAndConvertingData = async (cart) => {
  const categories = ["pizza", "topping"];
  const cartForDatabase = {
    pizza: [],
    topping: [],
  };
  const errorsArray = [];

  for (const category of categories) {
    //Loops through pizzas/toppings in the database
    for (const key in cart[category]) {
      const itemToModify =
        category === "pizza"
          ? await Pizza.findOne({ _id: key.toString() })
          : await Topping.findOne({ _id: key.toString() });

      if (!itemToModify) throw { status: 400, msg: "Hiba a kosár adataiban" };

      //converts the datastructure of the cart
      cartForDatabase[category].push({
        id: key,
        name: itemToModify.name,
        price: itemToModify.price,
        quantity: parseInt(cart[category][key]),
      });

      //If stock minus ordered quantity is less than zero
      const newStock = itemToModify.stock - parseInt(cart[category][key]);
      if (newStock < 0) {
        //then put a message in the errorsArray
        errorsArray.push({
          msg: `${itemToModify.name} készlet: ${itemToModify.stock} db !`,
        });
      } else {
        //else modify the stock of the pizza
        itemToModify.stock = newStock;
        await itemToModify.save();
      }
    }
  }

  return { errorsArray, cartForDatabase };
};

exports.order = async (orderData, user) => {
  const { cart } = orderData;

  const currentUser = await User.findOne({ email: user.email });
  if (!currentUser) throw { status: 400, msg: "Hiba a kosár adataiban" };

  const { errorsArray, cartForDatabase } = await checkingAndConvertingData(
    cart
  );

  //If there is any stock shortage then sends a message
  if (errorsArray.length) throw { status: 401, errors: errorsArray };

  //else saves the order of the user
  orderData.cart = cartForDatabase;
  currentUser.orders.push(orderData);
  await currentUser.save();
  return { success: true };
};
