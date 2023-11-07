const asyncHandler = require("express-async-handler");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const config = require("../config/config");
const jwt = require('jsonwebtoken');

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  const accessTokenFromHeader = req.headers.access_token;

  if (!accessTokenFromHeader) {
    res.status(httpStatus.NOT_FOUND).send('Access token not found');
  }

  // get userId from token
  const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
  const userId = payload.sub;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "firstName lastName avatar").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName avatar email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
