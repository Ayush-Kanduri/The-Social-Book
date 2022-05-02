//Require the Nodemailer Configuration module
const nodeMailer = require("../config/nodemailer");
//Require the Dotenv module
const dotenv = require("dotenv").config();

//This is another way of exporting the function.
exports.newComment = (comment) => {
	nodeMailer.transporter.sendMail(
		{
			//Reference Email Address
			from: process.env.fromEmail,
			//RECEIVER'S EMAIL ADDRESS
			to: comment.post.user.email,
			subject: "New Comment on your Post!",
			html: `<h1>Someone has Commented on your Post!</h1>`,
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
