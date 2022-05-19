const User = require("../models/user");
const Chat = require("../models/chat");
const Room = require("../models/room");

module.exports.chatMessage = async function (req, res) {
	try {
		if (!req.user) {
			return res.redirect("/users/login");
		}
		let { friend_email, chat_room, timestamp, message, user_email } =
			req.body;
		let alignment = "";

		const user = await User.findOne({ email: user_email }).populate();
		const friend = await User.findOne({ email: friend_email }).populate();

		let existingChat = await Chat.findOne({
			content: message,
			sender: user._id,
			receiver: friend._id,
			time: timestamp,
			room: chat_room,
		});

		if (existingChat) {
			if (chat.sender.toString() === req.user._id.toString()) {
				alignment = "sender";
			} else {
				alignment = "receiver";
			}
			return res.status(200).json({
				message: "Chat already exists",
				data: {
					message: message,
					user_name: user.name,
					user_email: user.email,
					friend_name: friend.name,
					friend_email: friend.email,
					alignment: alignment,
					timestamp: timestamp,
					chat_room: chat_room,
				},
			});
		}

		let chat = await Chat.create({
			content: message,
			sender: user._id,
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

		if (chat.sender.toString() === req.user._id.toString()) {
			alignment = "receiver";
		} else {
			alignment = "sender";
		}

		chat.save();
		room.chats.push(chat);
		room.save();
		user.chats.push(chat);
		friend.chats.push(chat);
		user.save();
		friend.save();

		if (req.xhr) {
			res.status(200).json({
				data: {
					message: message,
					user_name: user.name,
					user_email: user.email,
					friend_name: friend.name,
					friend_email: friend.email,
					alignment: alignment,
					timestamp: timestamp,
					chat_room: chat_room,
				},
			});
		}
	} catch (err) {
		console.log("Error: ", err);
		return res.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};

module.exports.chatRoom = async function (req, res) {
	try {
		if (!req.user) {
			return res.redirect("/users/login");
		}
		let chatRoom = "";
		let chats = [];
		let message = "";
		const userEmail = req.body.sender_email;
		const friendEmail = req.body.receiver_email;

		const user = await User.findOne({ email: userEmail });
		const friend = await User.findOne({ email: friendEmail });

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

		if (!room) {
			room = await Room.create({
				sender: user._id,
				receiver: friend._id,
			});
			user.rooms.push(room);
			friend.rooms.push(room);
			user.save();
			friend.save();
			message = "Chat Room Created";
			chatRoom = room._id.toString();
		} else {
			message = "Chat Room Found";
			chatRoom = room._id.toString();
		}
		room.save();

		await room.populate({
			path: "chats",
			options: { sort: { createdAt: "1" } },
			populate: [
				{
					path: "sender",
				},
				{
					path: "receiver",
				},
				{
					path: "content",
				},
				{
					path: "time",
				},
			],
		});

		if (room.chats.length > 0) {
			chats = room.chats;
		}

		if (req.xhr) {
			return res.status(200).json({
				data: {
					message: message,
					chatRoom: chatRoom,
					chats: chats,
				},
			});
		}
	} catch (err) {
		console.log("Error: ", err);
		return res.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};
