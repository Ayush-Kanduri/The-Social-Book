//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Require Multer Module for the File Uploading
const multer = require("multer");
//Require Path Module for the Directory
const path = require("path");
//The path where the files will be uploaded
const POST_IMAGES_PATH = path.join("/uploads/users/posts/images");
//The path where the files will be uploaded
const POST_VIDEOS_PATH = path.join("/uploads/users/posts/videos");

//Create the DB Schema
const postSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
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
		contentImage: {
			type: String,
		},
		contentVideo: {
			type: String,
		},
	},
	{
		timestamps: true,
		// Timestamp will create the createdAt and the updatedAt fields
	}
);

//Setting up the Image Disk Storage Engine
const imageStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", POST_IMAGES_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//Setting up the Video Disk Storage Engine
const videoStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", POST_VIDEOS_PATH));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

//Attaching the Image Disk Storage Engine to the Multer
//Static Function
postSchema.statics.uploadedPostImage = multer({ storage: imageStorage }).single(
	"contentImage"
);

//Attaching the Video Disk Storage Engine to the Multer
//Static Function
postSchema.statics.uploadedPostVideo = multer({ storage: videoStorage }).single(
	"contentVideo"
);

//POST_IMAGES_PATH should be available globally in the User Model using this function() & should tell the controller where the path would be.
//Static Function
postSchema.statics.postImagePath = POST_IMAGES_PATH;

//POST_VIDEOS_PATH should be available globally in the User Model using this function() & should tell the controller where the path would be.
//Static Function
postSchema.statics.postVideoPath = POST_VIDEOS_PATH;

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Post = mongoose.model("Post", postSchema);

//Export the Model/Collection
module.exports = Post;
