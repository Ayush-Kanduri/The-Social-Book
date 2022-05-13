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
		});
		//On refreshing the Server, the User gets Disconnected & gets Reconnected again.
	});
};
