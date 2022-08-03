//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require Posts-API Controller
const chatsAPIController = require("../../../controllers/api/v1/chats_api_controller");

//Access the Chats-API Controller's chatting() Function
router.post("/", chatsAPIController.chatting);

// router.delete(
// 	"/:id",
// 	passport.authenticate("jwt", { session: false }),
// 	postsAPIController.destroy
// );

//Export the Router
module.exports = router;
