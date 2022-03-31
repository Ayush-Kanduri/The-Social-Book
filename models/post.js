//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const postSchema = new mongoose.Schema(
	{
		post: {
			type: String,
			required: true,
		},
		user: {
			// The user is a reference to the user model with User Object ID Field
			type: mongoose.Schema.Types.ObjectId,
			//Refer to User Model Schema
			ref: "User",
		},
	},
	{
		timestamps: true,
		// Timestamp will create the createdAt and the updatedAt fields
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Post = mongoose.model("Post", postSchema);

//Export the Model/Collection
module.exports = Post;
