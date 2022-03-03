//------------Index Root of all the Routes------------//

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

//SYNTAX: router.METHOD("/Route_Name", Router_File_Name);
//Access the home Router File on '/' route.
router.use("/", homeRouterFile);
//Access the Users Router File on '/users' route.
router.use("/users", usersRouterFile);
//Access the Contacts Router File on '/users' route.
router.use("/contact", contactRouterFile);

//Router Loaded Successfully.
console.log("Router Loaded Successfully");
//Export the Index Router
module.exports = router;
