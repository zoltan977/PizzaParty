const asyncHandler = require("express-async-handler");
const UserService = require("../services/user.service");
const { validationResult } = require('express-validator');
const User = require("../models/User");

exports.login = asyncHandler(async (req, res) => {
  
  const errors = validationResult(req)
        
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const token = await UserService.login(req.body);
  return res.json({ token });
});

exports.register = asyncHandler(async (req, res) => {
  
  const errors = validationResult(req)
        
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const token = await UserService.register(req.body);
  return res.json({ token });
});

exports.google = asyncHandler(async (req, res) => {
  
  if (!req.body || !req.body.code)
      return res.json({error: "No code"})
        
  const code = req.body.code;

  const token = await UserService.google(code);
  return res.json({ token });
});

exports.loadUser = asyncHandler(async (req, res) => {
  
  const user = await User.findOne({email: req.user.email})
  // console.log("loaduser user", user)
  if (!user)
      return res.status(401).json({msg: "Nincs ilyen user"})
  else
      return res.json(user)
});
