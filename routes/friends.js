//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Contact Controller
const friendsController = require("../controllers/friends_controller");

//Access the Friends Controller's friends() Function
router.get("/", friendsController.friends);
//Access the Friends Controller's toggleFriendship() Function
router.post("/toggle/:id", friendsController.toggleFriendship);
//Access the Friends Controller's removeFriend() Function
router.post("/delete/:id", friendsController.removeFriend);

//Export the Router
module.exports = router;
