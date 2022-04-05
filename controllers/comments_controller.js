//Require the Comment Model Data Structure
const Comment = require("../models/comment");
//Require the Post Model Data Structure
const Post = require("../models/post");

//Export the Comments Controller's create() Function
module.exports.create = async (req, res) => {
	try {
		//req.body.post is the post-id of the post we want to comment on. This will fetch the value (post-id) of the input field with the name of post.

		//We need to create a new comment over a post, so first we need to find the post with that post-id if it exists or not, as someone may fiddle with inspect element in the browser.
		//Then create the comment, add post-id to the Comment Schema, assign the comment to that post, and add that comment-id to the comments array inside the Post Schema.

		//Find Post
		let post = await Post.findById(req.body.post);

		if (post) {
			//Create Comment
			let comment = await Comment.create({
				//Form content
				content: req.body.content,
				//Add post-id to the Comment Schema & assign the it to that post
				post: req.body.post,
				//Passport previously added the current user to the request object.
				user: req.user._id,
			});

			//This comment is pushed to the comments array of the Post Schema which will automatically fetch the comment-id from it.
			post.comments.push(comment);
			//Whenever we update something, we call save() method to update the database.
			post.save();

			return res.redirect("/");
		}
	} catch (err) {
		console.log("Error: ", err);
		return;
	}
};

//Export the Comments Controller's destroy() Function
module.exports.destroy = async (req, res) => {
	//Find the Comment
	let comment = await Comment.findById(req.params.id);
	if (comment.user == req.user.id) {
		let postID = comment.post;
		//Delete the Comment
		comment.remove();
		//Find the Post & Remove the Comment-id from the comments array
		await Post.findByIdAndUpdate(postID, {
			$pull: { comments: req.params.id },
		});
		console.log("Comment Deleted");
		return res.redirect("back");
	} else {
		return res.redirect("back");
	}
};
