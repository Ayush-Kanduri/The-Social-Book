//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

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

//SYNTAX: router.METHOD("Users: Sub-Router", MIDDLEWARE, usersController.FUNCTION_NAME);
//Passport as route level middleware to authenticate the user.
//If successful, done callback provides the user.
//If unsuccessful, done callback provides the failure.
router.post(
	"/create-session",
	passport.authenticate(
		//Strategy to be used for authentication
		"local",
		//Failure Redirect URL
		{ failureRedirect: "/users/login" }
	),
	usersController.createSession
);

//Export the Router
module.exports = router;
