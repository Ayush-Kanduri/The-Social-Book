const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		content: {
			type: String,
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		time: {
			type: String,
		},
		room: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
