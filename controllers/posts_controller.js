//Require the Post Model Data Structure
const Post = require("../models/post");

//Export the Posts Controller's create() Function
module.exports.create = (req, res) => {
	Post.create(
		{
			content: req.body.content,
			user: req.user._id,
		},
		(err, post) => {
			if (err) {
				console.log("Error in creating post");
				return;
			}
			return res.redirect("back");
		}
	);
};
