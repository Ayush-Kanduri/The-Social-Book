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

		// this.socket = io.connect("http://54.160.184.63:5000");
		// this.socket = io.connect("http://localhost:5000");
		this.socket = io.connect(
			"https://the-social-book-mini-chat-server.onrender.com"
		);

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
			//'this' scope has been changed inside the on() function

			//Name of the Event can be anything but should be meaningful & should correspond with the Event on the Server Side.
			//When this Event is Emitted, it will be Received in the Server's Chat_Socket File where it will fire the Event - 'connect'.

			/* We are Sending/Emitting an Event from the Client Side,
			On() Detects/Receives that sent Event on the Server Side,
			Just like how an Event Listener Detects an Event. */
			//---------//
			// console.log("Connection Established using Sockets");
			// console.log("Your Socket ID: ", self.socket.id);
			//---------//

			self.onlineStatusUpdate(self);
			self.configureChatBox(self);
		});

		self.userJoined(self);
		self.userLeft(self);
		self.receiveMessage(self);
		self.socket.on("user_offline", function (data) {
			//---------//
			// console.log("Online Users: ", data);
			//---------//
			//Convert Object to a [key, value] Array
			let arr = Object.entries(data);
			//Remove the Self User from the Online Users List
			arr = arr.filter((item) => item[0] != self.socket.id);
			//Convert the [key, value] Array back to an Object
			let obj = Object.fromEntries(arr);
			//Highlight the Offline Users in the ChatBox
			self.onlineStatusToggle(obj);
		});
		self.socket.on("new_message_notify", function (data) {
			const el = document.getElementsByClassName("chat-friend");
			for (let i of el) {
				if (i.dataset.email === data.user_email) {
					i.querySelector("#new-messages").style.color = "black";
				}
			}
		});
	}

	sendMessage(self, data) {
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
					chat_room: data.chat_room,
					friend_email: data.friend_email,
				});
			}
			$(" #message-input").val("");
		});
	}

	receiveMessage(self) {
		//Receives/Detects the Event - 'receive_message'
		self.socket.on("receive_message", function (data) {
			if (data.sender === self.userEmail) {
				data.alignment = "sender";
			} else {
				data.alignment = "receiver";
			}

			self.chatMessage(data);
			self.socket.emit("new_message", data);

			//DON'T USE BELOW AJAX AS IT IS NOT WORKING
			//IT STORES THE VALUE TWICE FOR EACH USER OUT OF @ USERS
			//AJAX Call
			// $.ajax({
			// 	type: "POST",
			// 	url: "/messages/create",
			// 	data: {
			// 		message: data.message,
			// 		user_email: data.user_email,
			// 		user_name: data.user_name,
			// 		timestamp: data.timestamp,
			// 		chat_room: data.chat_room,
			// 		friend_email: data.friend_email,
			// 	},
			// 	success: function (data) {
			// 		data = data.data;
			// 		self.chatMessage(data);
			// 		self.socket.emit("new_message", data);
			// 	},
			// 	error: function (error) {
			// 		console.log("Error: ", error);
			// 	},
			// });
		});
	}

	chatMessage(data) {
		let chatUL = document.getElementById("chat-ul");
		let newMessage = document.createElement("li");
		let p = document.createElement("p");
		let nameSpan = document.createElement("span");
		let timeSpan = document.createElement("span");
		let textSpan = document.createElement("span");

		let messageType = data.alignment;

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
	}

	chatRoomAJAX(user_email, friend_email, self) {
		let room = "";
		//AJAX Call
		$.ajax({
			type: "POST",
			url: "/messages/join",
			async: false,
			data: {
				sender_email: user_email,
				receiver_email: friend_email,
			},
			success: function (data) {
				room = data.data.chatRoom;
				if (data.data.chats.length > 0) {
					for (let chat of data.data.chats) {
						let newData = {
							message: chat.content,
							user_name: chat.sender.name,
							timestamp: chat.time,
							alignment:
								chat.sender.email === self.userEmail
									? "sender"
									: "receiver",
						};
						self.chatMessage(newData);
					}
				}
			},
			error: function (error) {
				console.log("Error: ", error);
			},
		});
		return room;
	}

	onlineStatusUpdate(self) {
		self.socket.emit("online_status", {
			user_email: self.userEmail,
		});

		self.socket.on("user_online", function (data) {
			//---------//
			// console.log("Online Users: ", data);
			//---------//
			// Convert Object to a [key, value] Array
			let arr = Object.entries(data);
			// Remove the Self User from the Online Users List
			arr = arr.filter((item) => item[0] != self.socket.id);
			// Convert the [key, value] Array back to an Object
			let obj = Object.fromEntries(arr);
			// Highlight the Online Users in the ChatBox
			self.onlineStatusToggle(obj);
		});
	}

	userJoined(self) {
		//Receives the Event - 'user_joined'
		self.socket.on("user_joined", function (data) {
			//---------//
			// console.log(
			// 	`${data.user_name} has Joined the Chat Room ${data.chat_room}`
			// );
			//---------//
			self.sendMessage(self, data);
		});
	}

	userLeft(self) {
		//Receives the Event - 'user_left'
		self.socket.on("user_left", function (data) {
			//---------//
			// console.log(
			// 	`${data.user_name} has Left the Chat Room ${data.chat_room}`
			// );
			//---------//
		});
	}

	configureChatBox(self) {
		let chatBox = document.getElementById("chatbox");
		let friends = document.getElementsByClassName("chat-friend");
		let frndList = document.getElementsByClassName("chat-friends-list")[0];
		let chatScreen = document.getElementsByClassName("chat-screen")[0];
		let input = document.getElementsByClassName("chat-input")[0];
		let back = document.getElementById("toggle-back");
		let down = document.getElementById("toggle-down");
		let name = "";
		let email = "";
		let chatRoom = "";

		document.getElementById("other-chat-user").textContent = "";

		down.addEventListener("click", () => {
			chatBox.classList.toggle("ht-350");
			if (down.classList.contains("fa-angle-down")) {
				down.classList.remove("fa-angle-down");
				down.classList.add("fa-angle-up");
			} else {
				down.classList.remove("fa-angle-up");
				down.classList.add("fa-angle-down");
			}
		});

		const frnd = document.getElementById("hidden-friend-length").value;
		if (frnd === "0") return;

		for (let friend of friends) {
			friend.addEventListener("click", () => {
				frndList.classList.toggle("show");
				chatScreen.classList.toggle("hide");
				input.classList.toggle("hide");
				back.classList.toggle("hide");
				name = friend.getAttribute("data-name");
				email = friend.getAttribute("data-email");
				document.getElementById("other-chat-user").textContent = name;
				document.querySelectorAll("#chat-ul > li").forEach((item) => {
					item.remove();
				});
				back.onclick = () => {
					friend.querySelector("#new-messages").style.color =
						"rgb(111, 0, 0)";
				};
				chatRoom = self.chatRoomAJAX(self.userEmail, email, self);
				self.joinRoom(self, chatRoom, email);
			});
		}

		back.addEventListener("click", () => {
			frndList.classList.toggle("show");
			chatScreen.classList.toggle("hide");
			input.classList.toggle("hide");
			back.classList.toggle("hide");
			document.getElementById("other-chat-user").textContent = "";
			self.leaveRoom(self, chatRoom);
		});
	}

	onlineStatusToggle(data) {
		const frnd = document.getElementById("hidden-friend-length").value;
		if (frnd === "0") return;

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

	joinRoom(self, room, email) {
		self.socket.emit("join_room", {
			user_email: self.userEmail,
			user_name: self.userName,
			friend_email: email,
			chat_room: room,
		});
	}

	leaveRoom(self, room) {
		self.socket.emit("leave_room", {
			user_email: self.userEmail,
			user_name: self.userName,
			chat_room: room,
		});
	}
}
