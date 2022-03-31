//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Posts Controller
const postsController = require("../controllers/posts_controller");

//Access the Posts Controller's create() Function
router.post("/create", postsController.create);

//Export the Router
module.exports = router;
