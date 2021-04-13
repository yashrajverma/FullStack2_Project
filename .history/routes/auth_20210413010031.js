const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require("../config/keys")
const requireLogin=require('../middleware/loginmiddleware')

// routes.get("/protected", requireLogin,(req, res) => {
//   res.send("hello world!");
// });

routes.post("/signup", (req, res) => {
  const { name, email, password ,pic} = req.body;
  if (!name || !email || !password) {
    return res.status(422).json({error: "Please add all Fields" });
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already registered with the same email" });
      }
      bcryptjs.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,pic
        });
        user
          .save()
          .then((user) => {
            res.json({ message: "Saved Successfully" });
          })
          .catch((err) => {
            console.log({ error: ` from user ${err}` });
          });
      });
    })
    .catch((err) => {
      console.log({ error: ` from signup ${err}` });
    });
  res.json({ message: "Successfully Signed Up" });
});

routes.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Please add email or password" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: " User not found" });
    }
    bcryptjs.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        // res.json({ message: "Successfully Signed-In" });
        const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
        const {_id,name,email,followers,following,pic}=savedUser
        res.json({token,user:{_id,name,email,followers,following,pic}})
      } else {
        return res.status(422).json({ error: "Invalid Email or Password" });
      }
    }).catch((err)=>{
        console.log(err);
    })
  })
});

module.exports = routes;
