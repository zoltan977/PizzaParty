const mongoose = require("mongoose");

const ConfirmSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  code: {
    type: String,
  },
});

const ResetSchema = mongoose.Schema({
  date: {
    type: Date,
  },
  code: {
    type: String,
  },
});

const CartItemSchema = mongoose.Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
  },
});

const OrderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  cart: {
    pizza: {
      type: [CartItemSchema],
    },
    topping: {
      type: [CartItemSchema],
    },
  },
});

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    default: "no-image.png",
  },
  confirmation: {
    type: ConfirmSchema,
  },
  reset: {
    type: ResetSchema,
  },
  orders: {
    type: [OrderSchema],
  },
});

module.exports = mongoose.model("users", UserSchema);
