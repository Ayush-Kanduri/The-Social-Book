{
	try {
		function connection() {
			const userID = document.getElementById("hidden-user-id").value;
			const chatID = document.getElementById("hidden-chat-id").value;
			const userName = document.getElementById("hidden-user-name").value;
			new ChatEngine(chatID, userID, userName);
		}
		connection();
	} catch (e) {
		console.log(e);
	}
}
