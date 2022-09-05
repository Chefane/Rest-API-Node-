const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../model/authData");
const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");

//validate register inputs
const registerSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

//validate login inputs
const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {

  //check for errors
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Check if the user is already in the db
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send("Email allready exists");

  //hash passwords
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
    console.log('User registered successfully!')
  } catch (err) {
    res.status(400).send(err);
    console.log('There was a problem registering the user!');
  }
});

router.post("/login", async (req, res) => {

    //check in for erros
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
  
    //check if the user exists
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).send("Email or password is wrong");
  
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Email or password is wrong");
  
    //Create and assign a token
    const token = jwt.sign({ _id: user._id }, `$process.env.TOKEN_SECRET`);
    res.header("auth-token", token).send(token);
    console.log("login successful");
});

module.exports = router;
