const User = require("../../../models/user");
const Chat = require("../../../models/chat");
const Room = require("../../../models/room");

module.exports.chatting = async function (req, res) {
	try {
		let info = {};
		let { information } = req.body;
		let { chat_room, timestamp, message } = information;
		let { friend_email, user_email } = information;
		let alignment = "";

		const user = await User.findOne({ email: user_email }).populate();
		const friend = await User.findOne({ email: friend_email }).populate();

		let chat = await Chat.create({
			content: message,
			sender: user.id,
			receiver: friend._id,
			time: timestamp,
			room: chat_room,
		});

		let room = await Room.findOne({
			sender: user._id,
			receiver: friend._id,
		});

		if (!room) {
			room = await Room.findOne({
				sender: friend._id,
				receiver: user._id,
			});
		}

		await chat.save();
		room.chats.push(chat);
		await room.save();
		user.chats.push(chat);
		friend.chats.push(chat);
		await user.save();
		await friend.save();

		let sender = await User.findById(chat.sender).populate();
		sender = sender.email;
		info = {
			message: message,
			user_name: user.name,
			user_email: user.email,
			friend_name: friend.name,
			friend_email: friend.email,
			alignment: alignment,
			sender: sender,
			timestamp: timestamp,
			chat_room: chat_room,
		};
		return res.status(200).json({
			message: "Chat Sent Successfully",
			data: {
				info: info,
			},
		});
	} catch (err) {
		console.log("Error: ", err);
		return res.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};
