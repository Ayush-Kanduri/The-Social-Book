//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the User Model Data Structure
const User = require("../models/user");
//Require the Friendship Model Data Structure
const Friendship = require("../models/friendship");

//We need to give this function a name, since it is an object.
//Export the Home Controller's Home() Function to the "/" Route.
module.exports.home = async (request, response) => {
	//Populate the User (from user field) of each Post, Comments from comments array and the User making the comment from the Comment Schema.
	try {
		//CHANGE :: Populate the likes of each post and comment.
		const query = [
			{
				path: "user",
				// select: "title pages",
			},
			{
				path: "likes",
				// select: "director",
			},
		];

		let posts = await Post.find({})
			// .sort({ createdAt: "desc" })
			.sort("-createdAt") // To sort the posts in descending order.
			.populate("user")
			.populate({
				path: "comments",
				options: { sort: { createdAt: "desc" } },
				populate: query,
				// populate: {
				// 	path: "user",
				// 	select: "title pages",
				// },
			})
			.populate("likes");

		let users = await User.find({});

		let friends;

		try {
			friends = await Friendship.find({
				$or: [
					{
						from_user: request.user._id,
					},
					{
						to_user: request.user._id,
					},
				],
			})
				.populate("to_user", "-password -__v")
				.populate("from_user", "-password -__v");
		} catch (err) {
			// console.log(err);
			friends = [];
		}

		if (friends.length === 0) {
			friends = [];
		}

		return response.render("home", {
			title: "Home Page",
			posts: posts,
			all_users: users,
			friends: friends,
		});
	} catch (err) {
		console.log("Error: ", err);
		request.flash("error", err);
		return response.redirect("back");
	}
};
