//We need to give it a name, since it is an object.

//Export the Home Controller's Home() Function to the "/" Route.
module.exports.home = (request, response) => {
	// return response.end("<h1>Home Page</h1>");
	return response.render("home", {
		title: "Social Book",
	});
};

//Export the Home Controller's Welcome() Function to the "/" Route.
module.exports.welcome = () => {
	console.log("Welcome to the Home Page");
};
