const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const OrderController = require("../controllers/order.controller");
const DataController = require("../controllers/data.controller");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  UserController.userAccount("login")
);

router.post(
  "/register",
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  UserController.userAccount("register")
);

router.post(
  "/password",
  [
    check("code", "Please add code").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  UserController.userAccount("password")
);

router.post(
  "/reset",
  [check("email", "Please include a valid email").isEmail()],
  UserController.userAccount("reset")
);

router.post(
  "/google",
  [check("code", "Please add code").not().isEmpty()],
  UserController.userAccount("google")
);

router.post(
  "/confirm",
  [
    check("code", "Please add name").not().isEmpty(),
    check("email", "Please add email").not().isEmpty(),
  ],
  UserController.userAccount("confirm")
);

router.post("/name_change", [auth], UserController.nameChange);

router.get("/loaduser", [auth], UserController.loadUser);

router.post(
  "/order",
  [
    auth,
    check("email", "Please include a valid email").isEmail(),
    check("name", "Name is required").exists(),
    check("tel", "Phone number is required").exists(),
    check("address", "Address is required").exists(),
  ],
  OrderController.order
);

router.get("/orders", [auth], OrderController.orders);

router.get("/data", DataController.data);

module.exports = router;
