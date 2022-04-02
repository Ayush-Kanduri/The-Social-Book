//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");
//Requires the Passport Local Strategy Module
const passportLocal = require("../config/passport-local-strategy");

//Require Posts Controller
const postsController = require("../controllers/posts_controller");

//Access the Posts Controller's create() Function
router.post("/create", passport.checkAuthentication, postsController.create);
//Access the Posts Controller's destroy() Function
router.get(
	"/delete/:id",
	passport.checkAuthentication,
	postsController.destroy
);

//Export the Router
module.exports = router;
