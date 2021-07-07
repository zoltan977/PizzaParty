const User = require("../models/User");
const Pizza = require("../models/Pizza");
const Topping = require("../models/Topping");


exports.order = async (orderData, user) => {
  const order = orderData
  const cart = order.cart
  // console.log("order cart: ", cart)
  
  const currentUser = await User.findOne({email: user.email})
  
  // console.log("order order:", order)

  currentUser.orders.push(order)

  // console.log("order current user", currentUser)

  const errorsArray = []
  for (const key in cart.pizza) {
      const pizzaToModify = await Pizza.findOne({_id: key.toString()})

      const newStock = pizzaToModify.stock - parseInt(cart.pizza[key])
      if (newStock < 0) {
          errorsArray.push({msg: `${pizzaToModify.name} készlet: ${pizzaToModify.stock} db !`})
      } else {

          pizzaToModify.stock = newStock
          await pizzaToModify.save()
      }
  }
  for (const key in cart.topping) {
      const toppingToModify = await Topping.findOne({_id: key.toString()})

      const newStock = toppingToModify.stock - parseInt(cart.topping[key])
      if (newStock < 0) {
          errorsArray.push({msg: `${toppingToModify.name} készlet: ${toppingToModify.stock} db !`})
      } else {

          toppingToModify.stock = newStock
          await toppingToModify.save()
      }
  }

  if (!errorsArray.length) {

      const savedUser = await currentUser.save()
      // console.log("order saved user:", savedUser)
      return {success: true};
  } else {
      return { errors: errorsArray };
  }
};

