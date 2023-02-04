const router = require("express").Router();
const Chat = require("../models/Chat");

//New Conversation
router.post("/", async (req, res) => {
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId;

  const lookupChat = await Chat.find({
    members: {
      $all: [senderId, receiverId],
    },
  }).select("_id");

  try {
    if (lookupChat.length) {
      console.log("We are in if block");

      res.status(200).json({
        message: "Success",
        data: lookupChat,
      });
    } else {
      const chatObj = [senderId, receiverId];
      console.log("We are in else block");
      console.log(chatObj);

      const newChat = await new Chat({
        members: chatObj,
      });

      const savedChatInstance = await newChat.save();
      res.status(200).json({
        message: "Success",
        data: savedChatInstance,
      });
    }
  } catch (err) {
    console.log("We are in error block");
    res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
