//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();
//Require the Passport Module
const passport = require("passport");

//Require Posts-API Controller
const postsAPIController = require("../../../controllers/api/v1/posts_api_controller");

//Access the Posts-API Controller's index() Function
router.get("/", postsAPIController.index);

//Access the Posts-API Controller's destroy() Function
//session: false, To prevent the session-cookies from being generated.
//User Authentication Check.
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	postsAPIController.destroy
);

//Export the Router
module.exports = router;
