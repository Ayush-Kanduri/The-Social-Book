//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Require Multer Module for the File Uploading
const multer = require("multer");
//Require Path Module for the Directory
const path = require("path");
//The path where the Multimedia files will be uploaded
const MULTIMEDIA_POST_PATH = path.join("/uploads/users/posts");

//Create the DB Schema
const postSchema = new mongoose.Schema(
	{
		//Text Post Content
		content: {
			type: String,
			required: true,
		},
		//User Reference to the User Schema & the User who posted the Post
		user: {
			// The user is a reference to the user model with User Object ID Field
			type: mongoose.Schema.Types.ObjectId,
			//Refer to User Model Schema
			ref: "User",
		},
		//Include the Array of IDs of all the comments in this Post Schema
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Like",
			},
		],
		//Image Post Content
		contentImage: {
			type: String,
		},
		//Video Post Content
		contentVideo: {
			type: String,
		},
	},
	{
		timestamps: true,
		// Timestamp will create the createdAt and the updatedAt fields
	}
);

//Filter Function for Images
const multimediaTypeFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/jpeg" ||
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/gif"
	) {
		if (file.size > 1024 * 1024 * 5) {
			cb(new Error("File is too large. Max size is 5MB"), false);
		} else {
			cb(null, true);
		}
	} else if (
		file.mimetype === "video/mp4" ||
		file.mimetype === "video/ogg" ||
		file.mimetype === "video/mkv" ||
		file.mimetype === "video/webm"
	) {
		if (file.size > 1024 * 1024 * 15) {
			cb(new Error("File is too large. Max size is 15MB"), false);
		} else {
			cb(null, true);
		}
	} else {
		cb(null, false);
	}
};

//Setting up the Multimedia Disk Storage Engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", MULTIMEDIA_POST_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//Attaching the Multimedia Disk Storage Engine to the Multer
//Static Function
postSchema.statics.uploadedMultimediaPost = multer({
	storage: storage,
	fileFilter: multimediaTypeFilter,
}).fields([
	{
		name: "contentImage",
		maxCount: 1,
	},
	{
		name: "contentVideo",
		maxCount: 1,
	},
]);

//MULTIMEDIA_POST_PATH should be available globally in the User Model using this function() & should tell the controller where the path would be.
//Static Function
postSchema.statics.multimediaPostPath = MULTIMEDIA_POST_PATH;

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Post = mongoose.model("Post", postSchema);

//Export the Model/Collection
module.exports = Post;
