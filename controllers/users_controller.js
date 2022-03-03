//Export the Users Controller's Profile() Function to the /User Routes.
module.exports.profile = (request, response) => {
	return response.end("<h1>Users Profile</h1>");
};

module.exports.welcome = (request, response) => {
	return response.end("<p>Welcome User Default</p>");
};
