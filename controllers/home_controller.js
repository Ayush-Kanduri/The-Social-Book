//We need to give it a name, since it is an object.

//Export the Home Controller's Home() Function to the Global Routes
module.exports.home = (request, response) => {
	return response.end("<h1>Home Page</h1>");
};
