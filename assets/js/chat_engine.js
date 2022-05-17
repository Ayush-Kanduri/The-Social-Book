class ChatEngine {
	//ID of the current Chat in the ChatBox
	//Email ID of the User
	constructor(chatBoxId, userEmail, userName) {
		this.chatBoxId = $(` #${chatBoxId}`);
		this.userEmail = userEmail;
		this.userName = userName;

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
			console.log("Your Socket ID: ", self.socket.id);

			self.socket.emit("online_status", {
				user_email: self.userEmail,
			});

			self.socket.on("user_online", function (data) {
				console.log("All Online Users: ", data);
				// Convert Object to a [key, value] Array
				let arr = Object.entries(data);
				// Remove the Self User from the Online Users List
				arr = arr.filter((item) => item[0] != self.socket.id);
				// Convert the [key, value] Array back to an Object
				let obj = Object.fromEntries(arr);
				// Highlight the Online Users in the ChatBox
				self.onlineStatus(obj);
			});

			self.socket.on("user_offline", function (data) {
				console.log("All Online Users: ", data);
				//Convert Object to a [key, value] Array
				let arr = Object.entries(data);
				//Remove the Self User from the Online Users List
				arr = arr.filter((item) => item[0] != self.socket.id);
				//Convert the [key, value] Array back to an Object
				let obj = Object.fromEntries(arr);
				//Highlight the Offline Users in the ChatBox
				self.onlineStatus(obj);
			});

			//'this' scope has been changed inside the on() function

			//Name of the Event can be anything but should be meaningful & should correspond with the Event on the Server Side.
			//When this Event is Emitted, it will be Received in the Server's Chat_Socket File where it will fire the Event - 'connect'.

			/* We are Sending/Emitting an Event from the Client Side,
			On() Detects/Receives that sent Event on the Server Side,
			Just like how an Event Listener Detects an Event. */
			self.socket.emit("join_room", {
				user_email: self.userEmail,
				user_name: self.userName,
				chat_room: "TheSocialBook",
			});

			//Receives the Event - 'user_joined'
			self.socket.on("user_joined", function (data) {
				console.log("---------------------------");
				console.log("New User has Joined the Chat Room: ", data);
				console.log("---------------------------");
			});
		});

		// CHANGE :: Send the message on clicking the Send button
		$(" #send-message-button").click((event) => {
			let msg = $(" #message-input").val();

			let options = {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			};

			if (msg !== "") {
				self.socket.emit("send_message", {
					message: msg,
					user_email: self.userEmail,
					user_name: self.userName,
					timestamp: new Date().toLocaleString("default", options),
					chat_room: "TheSocialBook",
				});
			}
			$(" #message-input").val("");
		});

		//Receives/Detects the Event - 'receive_message'
		self.socket.on("receive_message", function (data) {
			console.log("---------------------------");
			console.log("Message Received: ", data.message);
			console.log("---------------------------");
			let newData = {};

			//AJAX Call
			$.ajax({
				type: "POST",
				url: "/messages/create",
				data: {
					message: data.message,
					user_email: data.user_email,
					user_name: data.user_name,
					timestamp: data.timestamp,
					chat_room: data.chat_room,
				},
				success: function (data) {
					data = data.data;
					console.log(data.message);

					let chatUL = document.getElementById("chat-ul");
					let newMessage = document.createElement("li");
					let p = document.createElement("p");
					let nameSpan = document.createElement("span");
					let timeSpan = document.createElement("span");
					let textSpan = document.createElement("span");

					let messageType = "sender";
					if (data.user_email === self.userEmail) {
						messageType = "receiver";
					}

					p.classList.add("chat-message", messageType);
					newMessage.classList.add("chat-li", messageType);
					nameSpan.classList.add("chat-message-name");
					timeSpan.classList.add("chat-message-time");
					textSpan.classList.add("chat-message-text");

					nameSpan.textContent = data.user_name;
					timeSpan.textContent = data.timestamp;
					textSpan.textContent = data.message;

					p.appendChild(nameSpan);
					p.appendChild(timeSpan);
					p.appendChild(textSpan);
					newMessage.appendChild(p);
					chatUL.appendChild(newMessage);
					chatUL.scrollTop = chatUL.scrollHeight;
				},
				error: function (error) {
					console.log("Error: ", error);
				},
			});
		});
	}

	chatAJAX() {}

	onlineStatus(data) {
		let arr = document.getElementsByClassName("chat-friend");
		//Check if there are any Online Users :: If the Object is Empty
		if (
			data &&
			Object.keys(data).length === 0 &&
			data.constructor === Object
		) {
			for (let item of arr) {
				item.children[2].children[0].children[0].style.color =
					"rgb(111, 0, 0)";
			}
			return;
		}
		//Update the Online Status of the Users
		for (const [socketID, email] of Object.entries(data)) {
			for (let item of arr) {
				item.children[2].children[0].children[0].style.color =
					"rgb(111, 0, 0)";
				if (item.getAttribute("data-email") === email) {
					item.children[2].children[0].children[0].style.color = "green";
				}
			}
		}
	}
}
