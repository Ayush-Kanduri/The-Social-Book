//Require the Nodemailer Configuration module
const nodeMailer = require("../config/nodemailer");
//Require the Dotenv module
const dotenv = require("dotenv").config();

//This is another way of exporting the function.
exports.newPost = (post) => {
	let htmlString = nodeMailer.renderTemplate(
		{ post: post },
		"/posts/new_post.ejs"
	);

	nodeMailer.transporter.sendMail(
		{
			//Reference Email Address
			from: process.env.fromEmail,
			//RECEIVER'S EMAIL ADDRESS
			to: post.user.email,
			subject: "Post Published!",
			html: htmlString,
		},
		(err, info) => {
			//Info carries the information about the request that has been sent.
			if (err) {
				console.log("Error in sending the Mail: ", err);
				return;
			}
			return;
		}
	);
};
