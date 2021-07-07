const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");
const OrderController = require("../controllers/order.controller");
const DataController = require("../controllers/data.controller");
const auth = require("../middleware/auth");
const { check } = require('express-validator');

router.post("/login", 
    [
        check('email', 'Please include a valid email')
        .isEmail(),
        check('password', 'Password is required')
        .exists()
    ], 
    UserController.login);

router.post("/register", 
    [
        check('name', 'Please add name')
        .not().isEmpty(),
        check('email', 'Please include a valid email')
        .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
    ], 
    UserController.register);

router.post("/google", 
    UserController.google);

router.get("/loaduser", 
    [
        auth
    ],
    UserController.loadUser);

router.post("/order", 
    [
        auth,
        check('email', 'Please include a valid email')
        .isEmail(),
        check('name', 'Name is required')
        .exists(),
        check('tel', 'Phone number is required')
        .exists(),
        check('address', 'Address is required')
        .exists()
    ],
    OrderController.order);

router.get("/orders", 
    [
        auth
    ],
    OrderController.orders);

router.get("/data", 
    DataController.data);


module.exports = router;
