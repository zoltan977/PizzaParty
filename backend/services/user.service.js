const User = require("../models/User");
const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const bcrypt = require('bcryptjs');

const createToken = user => {
  const payload = {
      "user": {
          name: user.name,
          email: user.email,
          photo: user.photo
      }
  }

  const token = jwt.sign(payload,
      process.env.JWT_SECRET, 
      {
          expiresIn: 3600
      })

  return token;
}


exports.login = async (loginData) => {
  const { email, password } = loginData;
    
  const user = await User.findOne({ email })

  if (!user) {
      // return res.status(400).json({ msg: 'Invalid credentials' })
      throw {status: 400, msg: 'Invalid credentials'}
  }

  if (!user.password) {
      // return res.status(400).json({ msg: 'No password. Maybe you registered with google' })
      throw {status: 400, msg: 'No password. Maybe you registered with google'}
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      // return res.status(400).json({ msg: 'Invalid credentials' })
      throw {status: 400, msg: 'Invalid credentials'}
  }

  const token = createToken(user)

  return token;
};

exports.register = async (registrationData) => {

  const { name, email, password } = registrationData;
  const user = await User.findOne({ email })

  if (user) {
      // return res.status(400).json({ msg: 'User already exists' })
      throw {status: 400, msg: 'User already exists'}
  }

  const newUser = new User({name, email, password})
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(password, salt);

  const savedUser = await newUser.save()
  
  const token = createToken(savedUser)

  return token;
};

exports.google = async (code) => {

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: process.env.GRANT_TYPE
    })
  })

  if (!response.ok) {
      console.log("error getting token!")
      // return res.json({error: "error getting token!"})
      throw {status: 400, msg: 'Error getting token!'}
  } else {

      const data = await response.json()

      const { email, name, picture: photo } = jwt.decode(data.id_token);

      const user = await User.findOneAndUpdate(
          { email },
          {
            name,
            email,
            photo,
          },
          { upsert: true, setDefaultsOnInsert: true, new: true }
      );

      const token = createToken(user)

      return token;
  }
};
