//----------------------------------------------------------------//
//Index Root of all the V1 - API Routes//
//----------------------------------------------------------------//
//Require the existing Express
const express = require("express");
//Create an Index Router
const router = express.Router();

//Require Posts-API Router File
const postsAPIRouterFile = require("./posts");
//Require Users-API Router File
const usersAPIRouterFile = require("./users");
//Require Chats-API Router File
const chatsAPIRouterFile = require("./chats");

//Access the Chats-API Router File on '/api/v1/chats' route.
router.use("/chats", chatsAPIRouterFile);
//Access the Posts-API Router File on '/api/v1/posts' route.
router.use("/posts", postsAPIRouterFile);
//Access the Users-API Router File on '/api/v1/users' route.
router.use("/users", usersAPIRouterFile);

//Router Loaded Successfully.
// console.log("V1 - API Index Router Loaded Successfully");
//Export the Index Router
module.exports = router;
