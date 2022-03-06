//Export the Users Controller's Profile() Function to the "/User" Routes.
module.exports.profile = (request, response) => {
	// return response.end("<h1>Users Profile</h1>");
	return response.render("user_profile", {
		title: "Social Book",
	});
};
