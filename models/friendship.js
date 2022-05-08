//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const friendshipSchema = new mongoose.Schema(
	{
		//the user who sent this request
		from_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		//the user who accepted this request, the naming is just for understanding, otherwise, the users won't see a difference
		to_user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const Friendship = mongoose.model("Friendship", friendshipSchema);

//Export the Model/Collection
module.exports = Comment;
