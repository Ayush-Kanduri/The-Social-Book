//We need to give it a name, since it is an object.

//Export the Home Controller's Home() Function to the "/" Route.
module.exports.home = (request, response) => {
	// return response.end("<h1>Home Page</h1>");
	// console.log(request.cookies);
	// response.cookie("userID", "12345");
	return response.render("home", {
		title: "Home Page",
	});
};
