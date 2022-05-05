//Require the Post Model Data Structure
const Post = require("../models/post");
//Require the User Model Data Structure
const User = require("../models/user");
//Require the Comment Model Data Structure
const Comment = require("../models/comment");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");
//Require the Posts Mailer
const postsMailer = require("../mailers/posts_mailer");
//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Post Email Worker
const postEmailWorker = require("../workers/post_email_worker");

//Export the Posts Controller's create() Function
module.exports.create = async (req, res) => {
	try {
		//Call Post static method to upload the Post Images & Videos
		Post.uploadedMultimediaPost(req, res, async (err) => {
			if (err) {
				let err = "Error Occurred while uploading the Post Multimedia";
				switch (err.code) {
					case "LIMIT_UNEXPECTED_FILE":
						err = "Only 1 Image & 1 Video Allowed";
						break;
					case "LIMIT_FILE_SIZE":
						err =
							"File is too large. Max size is, 5MB for Images & 15MB for Videos";
						break;
					case "INVALID_FILE_TYPE":
						err =
							"Invalid File Type. Only Images(png jpg jpeg gif) & Videos(mp4 ogg mkv webm) are allowed";
						break;
				}
				if (req.xhr) {
					try {
						return res.status(500).json({
							data: {
								error: err,
							},
							message:
								"Error Occurred while uploading the Post Multimedia",
						});
					} catch (err) {
						console.log(err);
					}
				} else {
					req.flash("error", err);
					return res.redirect("back");
				}
			}

			let contentImage, contentVideo;

			//If the Files are uploaded successfully
			if (req.files) {
				if (req.files.contentImage) {
					contentImage =
						Post.multimediaPostPath +
						"/" +
						req.files.contentImage[0].filename;
				} else {
					contentImage = "";
				}
				if (req.files.contentVideo) {
					contentVideo =
						Post.multimediaPostPath +
						"/" +
						req.files.contentVideo[0].filename;
				} else {
					contentVideo = "";
				}
			}

			//Set the Post Content
			const content = req.body.content;
			let user = req.user._id;

			//Create the Post
			let post = await Post.create({
				content: content,
				user: user,
				contentImage: contentImage,
				contentVideo: contentVideo,
			});

			//Populating the post with the required information.
			let newPost = await post.populate("user", ["name", "email"]);

			// ------------------------------------------------------------------
			//Sending that post to the mailer.
			// postsMailer.newPost(newPost);
			// ------------------------------------------------------------------

			//Parallel Job / Delayed Job for the Post Email Worker
			let job = queue.create("postEmails", newPost).save((err) => {
				if (err) {
					console.log("Error in adding the Job to the Queue: ", err);
					return;
				}
				console.log("Job Added to the Queue: ", job.id);
			});

			post = await post.populate("user", ["name", "avatar"]);

			if (req.xhr) {
				try {
					//Return JSON with a status of 200(Success) because the post is created.
					return res.status(200).json({
						data: {
							post: post,
							user: req.user,
							message: "Post Created !!!",
						},
						message: "Post Created !!!",
					});
				} catch (err) {
					const error = "Server Error in Creating Post !!!";
					console.log("Error: ", err);
					return res.status(500).json({
						error: error,
						message: error,
					});
				}
			}
			// If the request is made through normal Request (Not AJAX)
			req.flash("success", "Post Published !!!");
			return res.redirect("back");
		});
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
			console.log("Post Deleted");

			await Comment.deleteMany({ post: req.params.id });

			//We need to check if the request is AJAX or not.
			//The type of AJAX Request is XMLHttpRequest (XHR)
			//It returns the Data in JSON format as a Response to the AJAX Call which made the Request.
			if (req.xhr) {
				try {
					//Return JSON with a status of 200(Success).
					return res.status(200).json({
						data: {
							post_id: req.params.id,
						},
						message: "Post Deleted !!!",
					});
				} catch (err) {
					const error = "Server Error in Deleting Post !!!";
					console.log("Error: ", err);
					return res.status(500).json({
						error: error,
						message: error,
					});
				}
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
