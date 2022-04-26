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
		//It returns the Data in JSON format as a Response to the AJAX Call which made the Request.
		if (req.xhr) {
			try {
				//If we want to populate just the name of the user (we don't not want to send the password in the API), this is how we do it!
				// post = await post.populate("user");
				// post = await post.populate("user", "name");
				post = await post.populate("user", ["name", "avatar"]);

				//Return JSON with a status of 200(Success) because the post is created.
				return res.status(200).json({
					data: {
						post: post,
						user: req.user,
					},
					message: "Post Created !!!",
				});
			} catch (err) {
				console.log("Error: ", err);
				return res.status(500).json({
					data: {
						error: err,
					},
					message: "Error in Creating Post !!!",
				});
			}
		}

		//If the request is made through normal Request (Not AJAX)
		req.flash("success", "Post Published !!!");
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

			//We need to check if the request is AJAX or not.
			//The type of AJAX Request is XMLHttpRequest (XHR)
			//It returns the Data in JSON format as a Response to the AJAX Call which made the Request.
			if (req.xhr) {
				//Return JSON with a status of 200(Success).
				return res.status(200).json({
					data: {
						post_id: req.params.id,
					},
					message: "Post Deleted !!!",
				});
			}

			//If the request is made through normal Request (Not AJAX)
			req.flash("success", "Post deleted !!!");
			return res.redirect("back");
		} else {
			req.flash("err", "Post cannot be deleted !!!");
			return res.redirect("back");
		}
	} catch (err) {
		req.flash("error", err);
		return res.redirect("back");
	}
};
