const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../../controllers/message.controller");
// const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get( allMessages);
router.route("/").post( sendMessage);

module.exports = router;
