{
	try {
		const userID = document.getElementById("hidden-user-id").value;
		const chatID = document.getElementById("hidden-chat-id").value;
		new ChatEngine(chatID, userID);
	} catch (e) {
		console.log(e);
	}
}
