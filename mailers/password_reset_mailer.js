//Require the Nodemailer Configuration module
const nodeMailer = require("../config/nodemailer");
//Require the Dotenv module
const dotenv = require("dotenv").config();
//Require the Environment File for getting the Environment Variables
const env = require("../config/environment");

//This is another way of exporting the function.
exports.passwordReset = (resetPasswordToken) => {
	let htmlString = nodeMailer.renderTemplate(
		{ token: resetPasswordToken },
		"/users/reset_password.ejs"
	);

	nodeMailer.transporter.sendMail(
		{
			//Reference Email Address
			from: env.email_sender,
			//RECEIVER'S EMAIL ADDRESS
			to: resetPasswordToken.user.email,
			subject: "Reset Password | The Social Book 🎊",
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
