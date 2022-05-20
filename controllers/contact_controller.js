//Require the Dotenv Library
const dotenv = require("dotenv").config();
//{path: "path/filename"}
//Require the Environment File for getting the Environment Variables
const env = require("../config/environment");

//Export the Contact Controller's contact().
module.exports.contact = (request, response) => {
	// return response.end("<h1>Contact Page</h1>");
	return response.render("contact", {
		title: "Contact Us",
		api_key: env.google_maps_api_key,
	});
};

//Export the Contact Controller's about().
module.exports.about = (request, response) => {
	// return response.end("<h1>Contact Page</h1>");
	return response.render("about", {
		title: "About Us",
	});
};
