//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

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
