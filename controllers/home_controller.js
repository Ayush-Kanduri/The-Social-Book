//Require the Post Model Data Structure
const Post = require("../models/post");

//We need to give this function a name, since it is an object.
//Export the Home Controller's Home() Function to the "/" Route.
module.exports.home = (request, response) => {
	//Populate the User (from user field) of each Post.
	Post.find({})
		.populate("user")
		.exec((err, posts) => {
			if (err) {
				console.log("Error in Fetching Posts & User");
				return;
			}
			return response.render("home", {
				title: "Home Page",
				posts: posts,
			});
		});
};
