//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Posts-API Controller
const postsAPIController = require("../../../controllers/api/v2/posts_api_controller");

//Access the Posts-API Controller's index() Function
router.get("/", postsAPIController.index);

//Export the Router
module.exports = router;
