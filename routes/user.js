const router = require("express").Router();
const User = require("../models/User");
const { route } = require("./auth");

router.post("/onlineUsers", async (req, res) => {
  // const userIdsArray = req.body.usersArray;
  console.log("Get all online users!");

  const usersOnline = req.body.usersOnline;

  const records = await User.find({
    _id: { $in: usersOnline },
    $sort: {
      "Items.username": -1,
    },
  }).select(["username", "profilePic", "bio"]);

  try {
    if (records) {
      res.status(200).json({
        message: "Success",
        users: records,
      });
    } else {
      res.status(404).json({
        message: "Some error occured please try again later!",
      });
    }
  } catch {
    res.status(403).json("Error Occured!");
  }
});

router.post("/image", async (req, res) => {
  const user = await User.findById({ _id: req.body._id });

  console.log(user);
  try {
    if (user) {
      const savedUpdatedData = await user.updateOne({
        profilePic: req.body.imageUrl,
      });

      savedUpdatedData &&
        res.status(200).json({
          message: "Success",
          updatedUser: savedUpdatedData,
        });
    }
  } catch {
    res.status(403).json("Error Occured!");
  }
});

router.post("/update", async (req, res) => {
  const user = await User.findById({ _id: req.body._id });

  try {
    if (user) {
      const saveUpdatedUser = await user.updateOne({
        bio: req.body.bio,
      });

      saveUpdatedUser &&
        res.status(200).json({
          message: "Success",
          updatedUser: saveUpdatedUser,
        });
    }
  } catch {
    res.status(403).json("Error Occured!");
  }
});

module.exports = router;
