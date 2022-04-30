//Require the Post Model Data Structure
const Post = require("../../../models/post");
//Require the Comment Model Data Structure
const Comment = require("../../../models/comment");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");

module.exports.index = async function (req, res) {
	try {
		let posts = await Post.find({})
			// .sort({ createdAt: "desc" })
			.sort("-createdAt") // To sort the posts in descending order.
			.populate("user", { password: 0 })
			.populate({
				path: "comments",
				options: { sort: { createdAt: "desc" } },
				populate: {
					path: "user",
					select: { password: 0 },
				},
			});
		return res.status(200).json({
			message: "List of all the Posts",
			posts: posts,
		});
	} catch (err) {
		console.log(err);
	}
};

module.exports.destroy = async (req, res) => {
	//--------------user should not be present over here--------------//
	try {
		let post = await Post.findById(req.params.id);

		//User Authorization Check.
		if (post.user == req.user.id) {
			try {
				console.log("Post User ", post.user, typeof post.user);
				console.log("Req User ID ", req.user.id, typeof req.user.id);
				console.log("Req User _ID ", req.user._id, typeof req.user._id);
			} catch {}

			//If Post Image already exists in the Database
			if (post.contentImage) {
				//If Post Image already exists in the "/uploads/users/posts" Directory
				if (fs.existsSync(path.join(__dirname, "..", post.contentImage))) {
					//Delete that Post Image from the Directory
					fs.unlinkSync(path.join(__dirname, "..", post.contentImage));
				}
			}

			//If Post Video already exists in the Database
			if (post.contentVideo) {
				//If Post Video already exists in the "/uploads/users/posts" Directory
				if (fs.existsSync(path.join(__dirname, "..", post.contentVideo))) {
					//Delete that Post Video from the Directory
					fs.unlinkSync(path.join(__dirname, "..", post.contentVideo));
				}
			}

			//Delete the Post
			post.remove();
			//Delete the Post Comments
			await Comment.deleteMany({ post: req.params.id });

			//Return the Success Response
			return res.status(200).json({
				message: "Post & associated Comments Deleted Successfully",
			});
		} else {
			return res.status(401).json({
				message: "You are not Authorized to Delete this Post !!!",
			});
		}
	} catch (err) {
		//Return the Error Response
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
