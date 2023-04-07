const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const JWT_SECRET = "Tharuka";


router.post("/register", async (req, res) => {
  try {
    //check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //create new user
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      message: "user created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

//user login

router.post("/login", async (req, res) => {
  try {
      //check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(200).send({ message: "User not exists", success: false });
  }
  //check password
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if(!validPassword){
    return res
      .status(200)
      .send({message:"Invalid password", success:false});

  }

  const token = jwt.sign(
    {userId : user._id},
    JWT_SECRET,
    {expiresIn:"1d"}
  );

  res.send({
    message:"User logged in SucessFully",
    success:true,
    data:token,
  });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data:error,
      success:false,

    })
  }


});

module.exports = router;
