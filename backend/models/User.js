const mongoose = require("mongoose");

const ConfirmSchema = mongoose.Schema({
  date:{
    type: Date
  },
  code: {
    type: String
  }
});

const ResetSchema = mongoose.Schema({
  date:{
    type: Date
  },
  code: {
    type: String
  }
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
    unique: true
  },
  photo: {
    type: String,
    default: 'default_profile.jpg'
  },
  confirmation: {
    type: ConfirmSchema
  },
  reset: {
    type: ResetSchema
  },
  orders: [
    {
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
          type: Object
        },
        topping: {
          type: Object
        }
      }
    }
  ]
});

module.exports = mongoose.model("users", UserSchema);