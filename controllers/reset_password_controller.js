const ResetPasswordToken = require("../models/resetPasswordToken");
const User = require("../models/user");

module.exports.reset = async function (req, res) {
	try {
		let resetPasswordToken = await ResetPasswordToken.findOne({
			access_token: req.query.accesstoken,
		});
		return res.render("reset_password", {
			title: "Reset Password",
			accessToken: req.query.accesstoken,
			isValid: resetPasswordToken.isValid,
		});
	} catch (err) {
		console.log(err);
		return res.redirect("/users/login");
	}
};

module.exports.updatePassword = async function (req, res) {
	try {
		const { password, confirm_password, token } = req.body;
		let resetPasswordToken = await ResetPasswordToken.findOne({
			access_token: token,
		});

		if (!resetPasswordToken) {
			//---------//
			// console.log("Invalid Token");
			//---------//
			req.flash("error", "Invalid Access Token!");
			return res.redirect("/users/login");
		}
		if (!resetPasswordToken.isValid) {
			//---------//
			// console.log("Token Expired");
			//---------//
			req.flash("error", "Access Token has Expired!");
			return res.redirect("/users/login");
		}
		if (password !== confirm_password) {
			//---------//
			// console.log("Password Mismatch");
			//---------//
			req.flash("error", "Password didn't match!");
			return res.redirect("back");
		}

		resetPasswordToken = await resetPasswordToken.populate("user");
		let user = resetPasswordToken.toObject().user;
		await User.findByIdAndUpdate(user._id, {
			password: password,
		});
		let result = await ResetPasswordToken.findOne({ access_token: token });
		result.isValid = false;
		result.save();
		req.flash("success", "Password Reset Successfully!");
		return res.redirect("/users/login");
	} catch (err) {
		console.log(err);
		return res.redirect("/users/login");
	}
};
