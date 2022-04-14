//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the Comment Model Data Structure
const Comment = require("../models/comment");

//Export the Posts Controller's create() Function
module.exports.create = async (req, res) => {
	try {
		let post = await Post.create({
			content: req.body.content,
			//We have Already Set the Authenticated User in the Request Object
			user: req.user._id,
		});

		//We need to check if the request is AJAX or not.
		//The type of AJAX Request is XMLHttpRequest (XHR)
		if (req.xhr) {
			//Return JSON with a status of 200(Success) because the post is created.
			return res.status(200).json({
				data: {
					post: post,
				},
				message: "Post Created !!!",
			});
		}

		req.flash("success", "Post published !!!");
		return res.redirect("back");
	} catch (err) {
		req.flash("error", err);
		return res.redirect("back");
	}
};

//Export the Posts Controller's destroy() Function
module.exports.destroy = async (req, res) => {
	try {
		let post = await Post.findById(req.params.id);

		//.id means converting the object id into string
		//If the User who posted the post == the User logged in
		//Object value == String value TRUE, Object value === String value FALSE
		//post.user is an Object with the User's Object ID
		//req.params.id is String, req.user.id is String, req.user._id is Object-Id
		if (post.user == req.user.id) {
			//Delete the Post
			post.remove();
			console.log("Post Deleted");
			await Comment.deleteMany({ post: req.params.id });
			req.flash("success", "Post deleted !!!");
			return res.redirect("back");
		} else {
			req.flash("err", "Post cannot be deleted !!!");
			return res.redirect("back");
		}
	} catch (err) {
		req.flash("error", err);
		return;
	}
};
