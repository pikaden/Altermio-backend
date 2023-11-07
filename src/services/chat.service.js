const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { User, Chat } = require('../models');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

/**
 * Get access chat from Chat model, include targetId and userId
 * userId is the author who message to other
 * @param {String} accessTokenFromHeader 
 * @param {String} targetId 
 */
const accessChat = async (accessTokenFromHeader, targetId) => {
    // get userId from token
    const payload = jwt.verify(accessTokenFromHeader, config.jwt.secret);
    const userId = payload.sub;

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: targetId } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        return isChat[0];
        // res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [targetId, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findById(createdChat.id).populate(
                "users",
                "-password"
            );
            return FullChat;
            // res.status(200).json(FullChat);
        } catch (error) {
            // res.status(400);
            throw new Error(error.message);
        }
    }
    // return users;
};

module.exports = {
    accessChat,
};
