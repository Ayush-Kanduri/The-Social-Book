//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Likes Controller
const likesController = require("../controllers/likes_controller");

//Access the Likes Controller's toggleLike() Function
router.post("/toggle", likesController.toggleLike);

//Export the Router
module.exports = router;
