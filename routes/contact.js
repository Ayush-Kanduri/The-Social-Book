//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Contact Controller
const contactController = require("../controllers/contact_controller");

//SYNTAX: router.METHOD("Contact: Sub-Router", contactController.FUNCTION_NAME);
//Access the Contact Controller's Contact() Function by '/contact' route.
router.get("/", contactController.contact);

//Export the Router
module.exports = router;
