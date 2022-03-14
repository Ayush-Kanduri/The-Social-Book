//Require the User Model Data Structure
const User = require("../models/user");

//Export the Users Controller's profile() Function
module.exports.profile = (request, response) => {
	// return response.end("<h1>Users Profile</h1>");
	return response.render("user_profile", {
		title: "User Profile",
	});
};

//Export the Users Controller's signUp() Function
module.exports.signUp = (req, res) => {
	return res.render("user_sign_up", {
		title: "Social Book | Sign Up",
	});
};

//Export the Users Controller's signIn() Function
module.exports.signIn = (req, res) => {
	return res.render("user_sign_in", {
		title: "Social Book | Login",
	});
};

//Export the Users Controller's createUser() Function
module.exports.createUser = (req, res) => {
	if (req.body.password !== req.body.confirm_password) {
		return res.redirect("back");
	}

	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			console.log("Error in finding user in signing up");
			return;
		}

		if (!user) {
			User.create(req.body, (err, user) => {
				if (err) {
					console.log("Error in creating user while signing up");
					return;
				}
				return res.redirect("/users/login");
			});
		} else {
			return res.redirect("back");
		}
	});
};

//Export the Users Controller's createSession() Function
module.exports.createSession = (req, res) => {
	// STEPS TO AUTHENTICATE A USER //
	// 1. Find the User by Email in the Database
	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			console.log("Error in finding user in signing in");
			return;
		}
		// 2. If User exists, then compare the password
		if (user) {
			// 3. If the password didn't match, then redirect back to login page
			if (user.password !== req.body.password) {
				return res.redirect("back");
			}
			// 4. If password matches, then create a session for the user and redirect to the profile page
			res.cookie("user_id", user.id);
			return res.redirect("/users/profile");
		}
		// 5. If User doesn't exist or Credentials didn't match, then redirect to login page
		else {
			return res.redirect("back");
		}
	});
};
