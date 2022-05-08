//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the User Model Data Structure
const User = require("../models/user");

//We need to give this function a name, since it is an object.
//Export the Home Controller's Home() Function to the "/" Route.
module.exports.home = async (request, response) => {
	//Populate the User (from user field) of each Post, Comments from comments array and the User making the comment from the Comment Schema.
	try {
		//CHANGE :: Populate the likes of each post and comment.
		let posts = await Post.find({})
			// .sort({ createdAt: "desc" })
			.sort("-createdAt") // To sort the posts in descending order.
			.populate("user")
			.populate({
				path: "comments",
				populate: {
					path: "likes",
				},
				options: { sort: { createdAt: "desc" } },
				populate: {
					path: "user",
				},
			})
			.populate("likes");

		let users = await User.find({});

		return response.render("home", {
			title: "Home Page",
			posts: posts,
			all_users: users,
		});
	} catch (err) {
		console.log("Error: ", err);
		request.flash("error", err);
		return response.redirect("back");
	}
};
