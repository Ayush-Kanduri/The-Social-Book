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
			origin: "http://localhost:8000",
		},
	});

	//Once the Connection is Established, it sends back an acknowledgement to the Client, that the Connection has been Established, by Emitting the 'connect' Event to the Client automatically.
	io.sockets.on("connection", function (socket) {
		//Receives the Connection & Emits back that you're Connected, using the Event - 'connect'
		console.log("New User Connected using Sockets: ", socket.id);
		//'socket' is the Connection Object with the information about the User sending the Message

		//Whenever the Client Disconnects, an automatic Event - 'disconnect' is Emitted/Fired
		//It detects that the socket is not connected anymore.
		socket.on("disconnect", function () {
			console.log("User Disconnected using Sockets: ", socket.id);
			//On refreshing the Server, the User gets Disconnected & gets Reconnected again.
		});

		socket.on("join_room", function (data) {
			console.log(
				"User's Request for Joining the Room has been Received: ",
				data
			);

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
	});
};
