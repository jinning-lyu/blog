const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//Update
router.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id) {
    if ("password" in req.body) {
      const user = await User.findById(req.params.id);
      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        res.status(400).json("Wrong credentials. Please try again.");
      } else {
        const salt = await bcrypt.genSalt(10);
        newPwd = await bcrypt.hash(req.body.newPwd, salt);
        await User.findByIdAndUpdate(req.params.id, {
          $set: { password: newPwd },
        });
        res.status(200).json("success!");
      }
    } else {
      try {
        const existingUser = await User.findOne({
          email: req.body.email,
        });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
          res.status(409).json("Email is already registered.");
        } else {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );
          await Post.updateMany(
            { userID: req.params.id },
            { $set: { username: req.body.username } }
          );
          res.status(200).json(updatedUser);
        }
      } catch (err) {
        res.status(500).json("Oops. Something went wrong.");
      }
    }
  } else {
    res.status(401).json("You can only update your account.");
  }
});

//Delete
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await User.findByIdAndDelete(req.params.id);
        await Post.deleteMany({ userID: user._id });
        res.status(200).json("User has been deleted.");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found.");
    }
  } else {
    res.status(401).json("You can only delete your account.");
  }
});

//Get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
