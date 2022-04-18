//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//We are importing Multer in User Models & not in Config, because we are uploading that file specific to that user & we'll have some specific settings.
//Avatar would be uploaded somewhere else but we are setting Multer for each Model individually.

//Require Multer Module for the File Uploading
const multer = require("multer");
//Require Path Module for the Directory
const path = require("path");
//The path where the files will be uploaded
const AVATAR_PATH = path.join("/uploads/users/avatars");

//Create the DB Schema
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
	// Timestamp will create the createdAt and the updatedAt fields
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const User = mongoose.model("User", userSchema);

//Export the Model/Collection
module.exports = User;
