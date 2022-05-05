//Require the Comment Model Data Structure
const Comment = require("../models/comment");
//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the Comments Mailer
const commentsMailer = require("../mailers/comments_mailer");
//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Comment Email Worker
const commentEmailWorker = require("../workers/comment_email_worker");

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

			//Populating the required comment with required details.
			let newComment = await comment.populate({
				path: "post",
				populate: {
					path: "user",
					select: [
						"name",
						"email",
						"content",
						"contentImage",
						"contentVideo",
					],
				},
			});

			// ------------------------------------------------------------------
			//Sending that comment information to the mailer.
			// commentsMailer.newComment(newComment);
			// ------------------------------------------------------------------

			//newComment is added to the Queue where the Worker will process the Job to send the Mail.
			//Creating a new Job inside the "Emails" Queue.
			//If a Queue doesn't exist, it will create a new Queue & add the Job to it.
			//If a Queue already exists, it will add the Job to that existing Queue.
			//Save() saves the new comment into the database.
			//Whenever something is Enqueued, it will create a new Job with an ID.
			//Every task that we put into the queue is a job.
			let job = queue.create("emails", newComment).save((err) => {
				if (err) {
					console.log("Error in sending the Job to the Queue: ", err);
					return;
				}
				console.log("Job Enqueued: ", job.id);
			});

			if (req.xhr) {
				try {
					// Similar for comments to fetch the user's id!
					// comment = await comment.populate("user");
					// comment = await comment.populate("user", "name");
					// comment = await comment.populate("user", ["name", "avatar"]);
					// comment = await comment.populate("user", "name avatar");
					comment = await comment.populate("user", ["name", "avatar"]);
					return res.status(200).json({
						data: {
							comment: comment,
							user: req.user,
						},
						message: "Post created!",
					});
				} catch (err) {
					console.log("Error: ", err);
					return res.status(500).json({
						data: {
							error: err,
						},
						message: "Error in creating the Comment",
					});
				}
			}

			req.flash("success", "Comment added !!!");
			return res.redirect("/");
		}
	} catch (err) {
		req.flash("error", err);
		return res.redirect("back");
	}
};

//Export the Comments Controller's destroy() Function
module.exports.destroy = async (req, res) => {
	try {
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

			// send the comment id which was deleted back to the views
			if (req.xhr) {
				return res.status(200).json({
					data: {
						comment_id: req.params.id,
					},
					message: "Post deleted",
				});
			}

			req.flash("success", "Comment deleted !!!");
			return res.redirect("back");
		} else {
			req.flash("error", "Comment cannot be deleted !!!");
			return res.redirect("back");
		}
	} catch (err) {
		req.flash("error", err);
		return res.redirect("back");
	}
};
