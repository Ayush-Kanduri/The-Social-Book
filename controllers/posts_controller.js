//Require the Post Model Data Structure
const Post = require("../models/post");

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
