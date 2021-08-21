const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res.status(401).json({
      msg: "Authentication error: No authorization header. Authorization denied",
    });
  }

  const token = authorizationHeader.split(" ")[1];

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

    res.locals.user = decoded.user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: "Authentication error" });
  }
};
