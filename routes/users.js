//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Users Controller
const usersController = require("../controllers/users_controller");

//SYNTAX: router.METHOD("Users: Sub-Router", usersController.FUNCTION_NAME);
//Access the Users Controller's Profile() Function by '/users/profile' route.
router.get("/profile", usersController.profile);
//Access the Users Controller's signUp() Function by '/users/signup' route.
router.get("/signup", usersController.signUp);
//Access the Users Controller's signIn() Function by '/users/login' route.
router.get("/login", usersController.signIn);
//Access the Users Controller's createUser() Function by '/users/create-user' route.
router.post("/create-user", usersController.createUser);

//Export the Router
module.exports = router;
