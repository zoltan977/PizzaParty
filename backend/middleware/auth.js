const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ msg: "Authentication error: No token. Authorization denied" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Authentication error: Token is not valid" });
  }

  try {
    const userExists = await User.findOne({ email: decoded.user.email });
    if (!userExists)
      return res
        .status(401)
        .json({ msg: "Authentication error: This user has been deleted" });

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(501).json({ msg: "Authentication error" });
  }
};
