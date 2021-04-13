const express = require("express");
const routes = express.Router();
const mongoose = require("mongoose");
const Post = mongoose.model("post");
const requireLogin = require("../middleware/loginmiddleware");
const User = mongoose.model("User");

routes.get("/user/:id", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).res.json({ err });
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      return res.status(404).json({ err: "User not Found" });
    });
});

routes.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ err });
        });
    }
  );
});

routes.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ err });
        });
    }
  );
});

routes.put("/updatepic", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true }).then(result=>{
      res.json({message:"Picture Updated"})
    }).catch(err=>{
      return res.status(422).json({err})
    })
});


routes.post('/search-users',(req,res)=>{
  let userPattern=new RegExp("^"+req.body.query)
  User.find({email:{$regex:userPattern}}).select("_id name email").then(user=>{
    res.json({user})
  }).catch(error=>{
    console.log(error);
  })
})

module.exports = routes;
