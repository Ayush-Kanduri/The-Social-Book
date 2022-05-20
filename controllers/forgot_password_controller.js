const User = require("../models/user");
const ResetPasswordToken = require("../models/resetPasswordToken");
const crypto = require("crypto");
const queue = require("../config/kue");
const passwordsResetMailer = require("../mailers/password_reset_mailer");
const passwordResetEmailWorker = require("../workers/reset_password_email_worker");
const db = require("../config/mongoose");

module.exports.forgot = function (req, res) {
	return res.render("forgot_password", {
		title: "Forgot Password",
	});
};

module.exports.checkUser = async function (req, res) {
	try {
		let user = await User.findOne({ email: req.body.email });

		if (!user) {
			req.flash("error", "Email does not exist in our Database!");
			return res.redirect("/forgot_password");
		}

		let resetPasswordToken = await ResetPasswordToken.create({
			access_token: crypto.randomBytes(20).toString("hex"),
			isValid: true,
			user: user._id,
		});

		resetPasswordToken.expire_at = resetPasswordToken.createdAt;
		resetPasswordToken.save();

		if (!resetPasswordToken) {
			req.flash("error", "Error in creating the Reset Password Token!");
			return res.redirect("/forgot_password");
		}

		resetPasswordToken = await resetPasswordToken.populate(
			"user",
			"name email"
		);

		resetPasswordToken = resetPasswordToken.toObject();

		let url = `${req.protocol}://${req.get(
			"host"
		)}/reset_password/?accesstoken=${resetPasswordToken.access_token}`;

		resetPasswordToken.url = url;
		// console.log(req.hostname);

		let job = queue
			.create("passwordResetEmails", resetPasswordToken)
			.save((err) => {
				if (err) {
					console.log("Error in sending the Job to the Queue: ", err);
					return;
				}
				//---------//
				// console.log("Job Enqueued: ", job.id);
				//---------//
			});

		req.flash("success", "Password Reset Link has been sent to your Email!");
		return res.redirect("/users/login");
	} catch (err) {
		console.log(err);
		req.flash("error", "Error in Finding the User");
		return res.redirect("/forgot_password");
	}
};
