//Export the Contact Controller's Contact() Function to the "/contact" Routes.
module.exports.contact = (request, response) => {
	// return response.end("<h1>Contact Page</h1>");
	return response.render("contact", {
		title: "Social Book",
	});
};
