const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = {
    user: {
      name: user.name,
      email: user.email,
      photo: user.photo,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 3600,
  });

  return token;
};

module.exports = createToken;
