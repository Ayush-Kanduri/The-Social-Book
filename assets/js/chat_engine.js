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
		let self = this;
		//As JavaScript is an Event Driven Language, 'On' detects an Event.
		//It Detects if the Connection has been Established
		this.socket.on("connect", function () {
			console.log("Connection Established using Sockets");
			//'this' scope has been changed inside the on() function

			//Name of the Event can be anything but should be meaningful & should correspond with the Event on the Server Side.
			//When this Event is Emitted, it will be Received in the Server's Chat_Socket File where it will fire the Event - 'connect'.

			/* We are Sending/Emitting an Event from the Client Side,
			On() Detects/Receives that sent Event on the Server Side,
			Just like how an Event Listener Detects an Event. */
			self.socket.emit("join_room", {
				user_email: self.userEmail,
				chat_room: "TheSocialBook",
			});

			//Receives the Event - 'user_joined'
			self.socket.on("user_joined", function (data) {
				console.log("New User has Joined the Chat Room: ", data);
			});
		});
	}
}
