//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Home Controller
const homeController = require("../controllers/home_controller");

//SYNTAX: router.METHOD("/", homeController.FUNCTION_NAME);
//Access the Home Controller's Home() Function by '/' route.
router.get("/", homeController.home);
//Call Welcome Function from the Home Controller
homeController.welcome();

//Export the Router.
module.exports = router;
