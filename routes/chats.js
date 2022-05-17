//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Chat Controller
const chatController = require("../controllers/chat_controller");

//Access the Chat Controller's chatting() Function
router.post("/create", chatController.chatting);

//Export the Router
module.exports = router;
