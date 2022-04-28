//----------------------------------------------------------------//
//Index Root of all the Routes//
//----------------------------------------------------------------//
//Require the existing Express
const express = require("express");
//Create an Index Router
const router = express.Router();

//Require Home Router File
const homeRouterFile = require("./home");
//Require Users Router File
const usersRouterFile = require("./users");
//Require Contacts Router File
const contactRouterFile = require("./contact");
//Require Posts Router File
const postsRouterFile = require("./posts");
//Require Comments Router File
const commentsRouterFile = require("./comments");
//Require Friends Router File
const friendsRouterFile = require("./friends");
//Require API Router Folder
const api = require("./api");

//SYNTAX: router.METHOD("/Route_Name", Router_File_Name);
//Access the Home Router File on '/' route.
router.use("/", homeRouterFile);
//Access the Users Router File on '/users' route.
router.use("/users", usersRouterFile);
//Access the Contacts Router File on '/contact' route.
router.use("/contact", contactRouterFile);
//Access the Posts Router File on '/posts' route.
router.use("/posts", postsRouterFile);
//Access the Comments Router File on '/comments' route.
router.use("/comments", commentsRouterFile);
//Access the Comments Router File on '/friends' route.
router.use("/friends", friendsRouterFile);
//Access the API Router Folder on '/api' route.
router.use("/api", api);

//Router Loaded Successfully.
console.log("Main Index Router Loaded Successfully");
//Export the Index Router
module.exports = router;
