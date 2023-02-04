const router = require("express").Router();
const Message = require("../models/Message");

//New Conversation
router.post("/", async (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
    text: req.body.text,
  });
  const savedMessage = await newMessage.save();
  try {
    res.status(200).json({
      success: true,
      message: "message saved",
      data: savedMessage,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
});

router.post("/getConversation", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.body.conversationId,
    });

    res.status(200).json({
      message: "Success",
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
});

router.post("/sendMessages", async (req, res) => {
  const sendMessage = await new Message({
    conversationId: req.body.conversationId,
    sender: req.body.sender,
    text: req.body.text,
  });
  try {
    const savedMessage = await sendMessage.save();

    if (savedMessage) {
      res.status(201).json({
        message: "Success",
        data: savedMessage,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      err,
    });
  }
});

module.exports = router;
