//Require the Nodemailer Configuration module
const nodeMailer = require("../config/nodemailer");
//Require the Dotenv module
const dotenv = require("dotenv").config();
//Require the Environment File for getting the Environment Variables
const env = require("../config/environment");

//This is another way of exporting the function.
exports.newComment = (post) => {
	let htmlString = nodeMailer.renderTemplate(
		{ post },
		"/comments/new_comment.ejs"
	);

	nodeMailer.transporter.sendMail(
		{
			//Reference Email Address
			from: env.email_sender,
			//RECEIVER'S EMAIL ADDRESS
			to: post.user.email,
			subject:
				"New Comment on your Post | The Social Book 🎊",
			html: htmlString,
			// html: `<h1>Someone has Commented on your Post!</h1>`,
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
