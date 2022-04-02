//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the Comment Model Data Structure
const Comment = require("../models/comment");

//Export the Posts Controller's create() Function
module.exports.create = (req, res) => {
	Post.create(
		{
			content: req.body.content,
			//We have Already Set the Authenticated User in the Request Object
			user: req.user._id,
		},
		(err, post) => {
			if (err) {
				console.log("Error in creating post");
				return;
			}
			console.log("Post Created");
			return res.redirect("back");
		}
	);
};

//Export the Posts Controller's destroy() Function
module.exports.destroy = (req, res) => {
	Post.findById(req.params.id, (err, post) => {
		if (err) {
			console.log("Error in finding the post");
			return;
		}
		//.id means converting the object id into string
		//If the User who posted the post == the User logged in
		//Object value == String value TRUE, Object value === String value FALSE
		//post.user is an Object with the User's Object ID as a String
		if (post.user == req.user.id) {
			//Delete the Post
			post.remove();
			console.log("Post Deleted");
			Comment.deleteMany({ post: req.params.id }, (err) => {
				return res.redirect("back");
			});
		} else {
			return res.redirect("back");
		}
	});
};
