//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Users-API Controller
const usersAPIController = require("../../../controllers/api/v1/users_api_controller");

//Access the Users-API Controller's createSession() Function
router.post("/create-session", usersAPIController.createSession);

//Export the Router
module.exports = router;
