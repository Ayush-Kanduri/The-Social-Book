class ChatEngine {
	//ID of the current Chat in the ChatBox
	//Email ID of the User
	constructor(chatBoxId, userEmail) {
		this.chatBoxId = $(` #${chatBoxId}`);
		this.userEmail = userEmail;

		//'io' is a Global Variable which is available as soon as we imported the Socket.io CDN

		//Go & Connect to the Chat Server
		//io.connect fires an Event - 'connection'
		//Emits an Event - 'connect'
		this.socket = io.connect("http://localhost:5000");

		//If User Email Exists & Logged In
		if (this.userEmail) {
			this.connectionHandler();
		}
	}

	//FUNCTION: To handle To & Fro interaction b/w the Subscriber and the Observer
	connectionHandler() {
		//As JavaScript is an Event Driven Language, 'On' detects an Event.
		//It Detects if the Connection has been Established
		this.socket.on("connect", function () {
			console.log("Connection Established using Sockets");
		});
	}
}
