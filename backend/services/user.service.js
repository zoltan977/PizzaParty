const User = require("../models/User");
const jwt = require('jsonwebtoken');
const fetch = require("node-fetch");
const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

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
      throw {status: 400, msg: 'Invalid credentials'}
  }

  if (user.confirmation) {
    const date = Date.now()
    const confirmDate = Date.parse(user.confirmation.date)

    if ((date - confirmDate) > 300000) {
      await user.delete()
      throw {status: 400, msg: 'You have to sign up again!'}
    } else {
      throw {status: 400, msg: 'You have to confirm your sign up first!'}
    }

  }

  if (!user.password) {
      throw {status: 400, msg: 'No password. Maybe you registered with google'}
  }

  const isMatch = await bcrypt.compare(password, user.password)

  if (!isMatch) {
      throw {status: 400, msg: 'Invalid credentials'}
  }

  const token = createToken(user)

  return token;
};

exports.confirm = async (postedData) => {
  console.log("user service confirm posted data: ", postedData)
  const user = await User.findOne({ email: postedData.email })
  if (!user) 
    throw {status: 400, msg: 'No user with this email'}

  if (!user.confirmation)
    throw {status: 400, msg: 'No user with this email waiting for confirmation'}

  const date = Date.now()
  const confirmDate = Date.parse(user.confirmation.date)

  if (user.confirmation.code !== postedData.code)
    throw {status: 400, msg: 'Generated random codes do not match!'}

  if ((date - confirmDate) > 300000) {
      console.log("confirmation date-confirmDate:", (date - confirmDate))
      await user.delete()
      throw {status: 400, msg: 'More than 5 minutes has passed since the registration!'}
  }
  else {
      user.confirmation = undefined
      const savedUser = await user.save()
      console.log("confirmation saved user: ", savedUser)
      const token = createToken(savedUser)
      return token
  }
};

exports.register = async (registrationData) => {

  const { name, email, password } = registrationData;
  const user = await User.findOne({ email })

  if (user) {
      throw {status: 400, msg: 'User already exists'}
  }

  try {
    const newUser = new User({name, email, password})
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    const buf = randomBytes(256);
    newUser.confirmation = {
      code: buf.toString('hex'),
      date: new Date()
    }
  
    const savedUser = await newUser.save()
    
    // const token = createToken(savedUser)
    
    const info = await transporter.sendMail({
      from: `"Admin" ${process.env.email}`, // sender address
      to: savedUser.email, // list of receivers
      subject: "Confirm your email address", // Subject line
      html: `<p>To confirm your registration please click on this <a href="http://localhost:3000/confirm?code=${buf.toString('hex')}&email=${savedUser.email}">confirm</a> link!</p>`
    });

  } catch (error) {
    console.log("Error creating uesr: ", error)
    throw {status: 400, msg: 'Error creating user'}
  }

  // return token;

  return {success: true}
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
      throw {status: 400, msg: 'Error getting token!'}
  } else {

      const data = await response.json()

      // console.log("google által visszaadott adatok: ", jwt.decode(data.id_token))

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

      if (user.confirmation) {
        user.confirmation = undefined
        await user.save()
      }

      const token = createToken(user)

      return token;
  }
};
