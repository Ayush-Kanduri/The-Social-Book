//Require Socket.io Admin UI Dashboard
const { instrument } = require("@socket.io/admin-ui");

//Communication over the Chat Sockets via Socket.io using Chat Server will take place here//

//Receiving the Request to Create the Connection
module.exports.chatSockets = function (socketServer) {
	//'io' is Established & will be Handling the Connections
	//'io' has all the Sockets
	const io = require("socket.io")(socketServer, {
		//To Enable CORS
		cors: {
			//To Allow the Origin to be our Server
			// origin: "*",
			// origin: "http://localhost:8000",
			origin: [
				"http://localhost:8000",
				"https://admin.socket.io/",
				"http://54.160.184.63",
				"http://thesocialbook.co.in",
			],
		},
	});

	let users = {};

	//Once the Connection is Established, it sends back an acknowledgement to the Client, that the Connection has been Established, by Emitting the 'connect' Event to the Client automatically.
	io.sockets.on("connection", function (socket) {
		//Receives the Connection & Emits back that you're Connected, using the Event - 'connect'
		//---------//
		// console.log("New User Connected using Sockets: ", socket.id);
		//---------//
		socket.on("online_status", function (data) {
			users[socket.id] = data.user_email;
			//---------//
			// console.log("Online Users: ", users);
			//---------//
			//Emit the Event to all other Clients except the one who sent the Event last
			//Only on refreshing the page of the Client who sent the Event, he will get the Event
			// User 1 comes Online
			// User 2 comes Online
			// User 2 gets the Event
			//socket.broadcast.emit("user_online", users);

			//Emit the Event to all other Clients except the one who sent the Event first
			//Only on refreshing the page of the Client who sent the Event, he will get the Event
			// User 1 comes Online
			// User 2 comes Online
			// User 1 gets the Event
			//socket.emit("user_online", users);

			//Emit the Event to all the Clients in the Connection at the same time
			io.emit("user_online", users);
		});

		//'socket' is the Connection Object with the information about the User sending the Message

		//Whenever the Client Disconnects, an automatic Event - 'disconnect' is Emitted/Fired
		//It detects that the socket is not connected anymore.
		socket.on("disconnect", function () {
			//---------//
			// console.log("User Disconnected using Sockets: ", socket.id);
			//---------//
			//On refreshing the Server, the User gets Disconnected & gets Reconnected again.
			delete users[socket.id];
			io.emit("user_offline", users);
		});

		socket.on("join_room", function (data) {
			//---------//
			// console.log(
			// 	`${data.user_name} has requested to Join the Room: ${data.chat_room}`
			// );
			//---------//
			//After Receiving the Request, we want that User/Socket to be Joined to that Particular Chat Room.
			//If a Chat Room with the name "data.chat_room" exists, then the User will be Joined to that Chat Room.
			//If a Chat Room with the name "data.chat_room" does not exist, then that Chat Room will be created & then the User will be entered into it.
			socket.join(data.chat_room);
			//After Joining that Chat Room, everyone present in that Chat Room should be notified that a new User has Joined the Chat Room.
			//Emit an Event inside this Chat Room & tell the Whole Room about it.

			/* To Emit an Event in a specific Chat Room - 'io.in(data.chat_room).emit()',
			Otherwise - 'socket.emit()' */
			//To Emit an Event to all the Users - 'io.emit()'
			//To Emit an Event to a Specific User - 'socket.emit()'
			io.in(data.chat_room).emit("user_joined", data);
		});

		socket.on("leave_room", function (data) {
			//---------//
			// console.log(
			// 	`${data.user_name} has requested to Leave the Room: ${data.chat_room}`
			// );
			//---------//
			socket.leave(data.chat_room);
			io.in(data.chat_room).emit("user_left", data);
		});

		// CHANGE :: Detect 'send_message' Event & broadcast the message to everyone in the room
		socket.on("send_message", function (data) {
			io.in(data.chat_room).emit("receive_message", data);
		});

		socket.on("new_message", function (data) {
			socket.broadcast.emit("new_message_notify", data);
		});
	});

	//Instrument the Socket.io Admin UI Dashboard
	instrument(io, { auth: false });
};
