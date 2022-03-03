//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Users Controller
const usersController = require("../controllers/users_controller");

//SYNTAX: router.METHOD("Users: Sub-Router", usersController.FUNCTION_NAME);
//Access the Users Controller's Profile() Function by '/users/profile' route.
router.get("/profile", usersController.profile);

//Export the Router
module.exports = router;
