//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Contact Controller
const friendsController = require("../controllers/friends_controller");

//Access the Friends Controller's friends() Function
router.get("/", friendsController.friends);

//Export the Router
module.exports = router;
