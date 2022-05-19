const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Chat",
			},
		],
	},
	{ timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
