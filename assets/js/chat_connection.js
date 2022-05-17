{
	try {
		function chat() {
			let chatBox = document.getElementById("chatbox");
			let friends = document.getElementsByClassName("chat-friend");
			let frndList = document.getElementsByClassName("chat-friends-list")[0];
			let chatScreen = document.getElementsByClassName("chat-screen")[0];
			let input = document.getElementsByClassName("chat-input")[0];
			let back = document.getElementById("toggle-back");
			let down = document.getElementById("toggle-down");

			back.style.display = "none";
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

			for (let friend of friends) {
				friend.addEventListener("click", () => {
					frndList.classList.toggle("show");
					chatScreen.classList.toggle("hide");
					input.classList.toggle("hide");
					back.style.display = "initial";
					let name = friend.getAttribute("data-name");
					document.getElementById("other-chat-user").textContent = name;
				});
			}

			back.addEventListener("click", () => {
				frndList.classList.toggle("show");
				chatScreen.classList.toggle("hide");
				input.classList.toggle("hide");
				back.style.display = "none";
				document.getElementById("other-chat-user").textContent = "";
			});
		}
		chat();
	} catch (e) {
		console.log(e);
	}

	try {
		const userID = document.getElementById("hidden-user-id").value;
		const chatID = document.getElementById("hidden-chat-id").value;
		const userName = document.getElementById("hidden-user-name").value;
		new ChatEngine(chatID, userID, userName);
	} catch (e) {
		console.log(e);
	}
}
