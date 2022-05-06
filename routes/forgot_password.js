//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Forgot Password Controller
const forgotPasswordController = require("../controllers/forgot_password_controller");

//Access the Forgot Password Controller's forgot() Function
router.get("/", forgotPasswordController.forgot);
//Access the Forgot Password Controller's checkUser() Function
router.post("/check-user", forgotPasswordController.checkUser);

//Export the Router
module.exports = router;
