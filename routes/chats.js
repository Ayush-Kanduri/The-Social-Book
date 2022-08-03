//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require Passport
const passport = require("passport");

//Require Chat Controller
const chatController = require("../controllers/chat_controller");

//Access the Chat Controller's chatMessage() Function
// router.post("/create", chatController.chatMessage);

//Access the Chat Controller's chatRoom() Function
router.post("/chatting", passport.checkAuthentication, chatController.chatting);
//Access the Chat Controller's chatRoom() Function
router.post("/join", passport.checkAuthentication, chatController.chatRoom);

//Export the Router
module.exports = router;
