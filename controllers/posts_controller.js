//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the Comment Model Data Structure
const Comment = require("../models/comment");

//Export the Posts Controller's create() Function
module.exports.create = async (req, res) => {
	try {
		await Post.create({
			content: req.body.content,
			//We have Already Set the Authenticated User in the Request Object
			user: req.user._id,
		});

		return res.redirect("back");
	} catch (err) {
		console.log("Error: ", err);
		return;
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
			return res.redirect("back");
		} else {
			return res.redirect("back");
		}
	} catch (err) {
		console.log("Error: ", err);
		return;
	}
};
