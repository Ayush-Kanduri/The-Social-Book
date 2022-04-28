//----------------------------------------------------------------//
//Index Root of all the API Routes//
//----------------------------------------------------------------//
//Require the existing Express
const express = require("express");
//Create an Index Router
const router = express.Router();

//Require V1 - API Index Router File
const v1 = require("./v1");
//Require V1 - API Index Router File
const v2 = require("./v2");

//Access the V1 - API Index Router File on '/api/v1' route.
router.use("/v1", v1);
//Access the V2 - API Index Router File on '/api/v2' route.
router.use("/v2", v2);

//Router Loaded Successfully.
console.log("API Index Router Loaded Successfully");
//Export the Index Router
module.exports = router;
