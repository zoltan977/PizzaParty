const asyncHandler = require("express-async-handler");
const UserService = require("../services/user.service");
const { validationResult } = require("express-validator");
const User = require("../models/User");

exports.userAccount = (service) =>
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const result = await UserService[service](req.body);
    return res.json(result);
  });

exports.loadUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(400).json({ msg: "Nincs ilyen felhasználó" });
  else return res.json({ name: user.name, photo: user.photo });
});

exports.nameChange = asyncHandler(async (req, res) => {
  const result = await UserService.nameChange(req.body.newName, req.user);
  return res.json(result);
});
