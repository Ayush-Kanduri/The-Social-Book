//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
//Require ValidatorJS for the Validation
const validator = require("validator");

//Create the DB Schema
const commentSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		//Comment belongs to a user
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},
	},
	{ timestamps: true }
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Comment = mongoose.model("Comment", commentSchema);

//Export the Model/Collection
module.exports = Comment;
