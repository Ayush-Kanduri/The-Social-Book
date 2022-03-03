//Require the existing Express
const { request } = require("express");
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Home Controller
const homeController = require("../controllers/home_controller");

//SYNTAX: router.METHOD("/", homeController.FUNCTION_NAME);
//Access the Home Controller's Home() Function by '/' route.
router.get("/", homeController.home);
homeController.welcome();

//Export the Router.
module.exports = router;
