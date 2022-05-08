const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async (req, res) => {
	//Like will work with AJAX requests, so we need to send back the JSON Data.
	try {
		//url => likes/toggle/?id=abcd&type=Post
		let likeable;
		//When we receive the JSON Data back, based on that (deleted) we can increment or decrement the likes.
		let deleted = false;
		//Likeable is the worthy candidate on which we can place the like.

		if (req.query.type === "Post") {
			//If the type is Post, then we need to find the Post with that id.
			likeable = await Post.findById(req.query.id).populate("likes");
		} else {
			//If the type is Comment, then we need to find the Comment with that id.
			likeable = await Comment.findById(req.query.id).populate("likes");
		}

		//Check if a Like already exists
		let existingLike = await Like.findOne({
			likeable: req.query.id,
			onModel: req.query.type,
			//Since we are putting the request under an authenticated request & a user cannot like without authentication.
			//One user can only Like a Post or a Comment only once.
			user: req.user._id,
		});

		if (existingLike) {
			//If the Like exists, we need to delete it.
			likeable.likes.pull(existingLike._id);
			likeable.save();
			existingLike.remove();
			deleted = true; //Like has been deleted
		} else {
			//If the Like does not exist, we need to create it.
			const like = await Like.create({
				user: req.user._id,
				likeable: req.query.id,
				onModel: req.query.type,
			});
			likeable.likes.push(like._id); //likeable.likes.push(like); --> Both are Same
			likeable.save();
		}
		return res.status(200).json({
			message: "Like created successfully",
			data: {
				deleted: deleted,
			},
		});
	} catch (err) {
		console.log(err);
		return res.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};
