const dotenv = require("dotenv").config();
//{path: "path/filename"}

//Export the Contact Controller's contact().
module.exports.contact = (request, response) => {
	// return response.end("<h1>Contact Page</h1>");
	return response.render("contact", {
		title: "Contact Us",
		api_key: process.env.GOOGLE_MAPS_API_KEY,
	});
};

//Export the Contact Controller's about().
module.exports.about = (request, response) => {
	// return response.end("<h1>Contact Page</h1>");
	return response.render("about", {
		title: "About Us",
	});
};
