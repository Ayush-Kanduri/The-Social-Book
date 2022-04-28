//Require the existing Express
const express = require("express");
//Create a Local Router
const router = express.Router();

//Require Posts-API Controller
const postsAPIController = require("../../../controllers/api/v1/posts_api_controller");

//Access the Posts-API Controller's index() Function
router.get("/", postsAPIController.index);
//Access the Posts-API Controller's destroy() Function
router.delete("/:id", postsAPIController.destroy);

//Export the Router
module.exports = router;
