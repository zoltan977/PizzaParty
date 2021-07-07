const mongoose = require("mongoose");

const PizzaSchema = mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        default: "default_pizza.jpg"
      },
      description: {
        type: String,
        required: true
      },
      stock: {
        type: Number,
        required: true,
      }
  });

module.exports = mongoose.model("pizza", PizzaSchema);