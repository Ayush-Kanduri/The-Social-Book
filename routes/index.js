//Root of all the Routes//

//Require the existing Express
const express = require("express");
//Create a Router
const router = express.Router();
//Require Home Controller
const homeController = require("../controllers/home_controller");

//Access the Home Controller's Home() Function by '/' route. Any Request from here would be forwarded to the home controller.
router.get("/", homeController.home);

console.log("Router Loaded");

//Export the Index Router
module.exports = router;
