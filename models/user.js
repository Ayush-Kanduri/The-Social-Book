//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
//Require ValidatorJS for the Validation
const validator = require("validator");

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
			validate(value) {
				//Automatic validation of the email using ValidatorJS
				if (!validator.isEmail(value)) {
					throw new Error("Email is Invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			//Custom validator for password
			validate(value) {
				if (value.length < 6) {
					throw new Error("Password should be at least 6 characters long");
				}
			},
			//Custom validator for password
			// validate: {
			// 	validator: function (value) {
			// 		return value.length >= 6;
			// 	},
			// 	message: "Password should be at least 6 characters long",
			// },
		},
		name: {
			type: String,
			required: true,
			trim: true,
			//In-built validator for password
			minlength: [2, "Name must be at least 2 characters long"],
		},
		avatar: {
			type: String,
		},
		friendships: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Friendship",
			},
		],
		rooms: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Room",
			},
		],
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Chat",
			},
		],
	},
	{ timestamps: true }
	// Timestamp will create the createdAt and the updatedAt fields
);

// -------------------------------------------------------------------
//Exact Path for the Avatar Uploading: will be the Current Directory relative to the Path of the Uploads Folder

//__dirname is directory/path of the user.js in Models
//We need to be at '..' (Models Folder)
//Now we go to the uploads folder using AVATAR_PATH

//Setting up the Disk Storage Engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//This attaches a Disk Storage of the Multer in the Storage Property
//single() - Uploads a single file only for the fieldname "avatar"

//Attaching the Disk Storage Engine to the Multer
//Static Function
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single(
	"avatar"
);

//AVATAR_PATH should be available globally in the User Model using this function() & should tell the controller where the path would be.
//Static Function
userSchema.statics.avatarPath = AVATAR_PATH;
// -------------------------------------------------------------------

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const User = mongoose.model("User", userSchema);

//Export the Model/Collection
module.exports = User;
