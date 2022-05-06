//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Reset Password Controller
const resetPasswordController = require("../controllers/reset_password_controller");

//Access the Reset Password Controller's reset() Function
router.get("/", resetPasswordController.reset);
//Access the Reset Password Controller's updatePassword() Function
router.post("/update-password", resetPasswordController.updatePassword);

//Export the Router
module.exports = router;
