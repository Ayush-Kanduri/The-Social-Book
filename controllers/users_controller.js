//Require the User Model Data Structure
const User = require("../models/user");

//Export the Users Controller's profile() Function
module.exports.profile = (request, response) => {
	// return response.end("<h1>Users Profile</h1>");
	// USER SHOULD BE ABLE TO ACCESS PROFILE PAGE ONLY WHEN LOGIN IS DONE CORRECTLY AS USER IS AUTHENTICATED, ELSE PROFILE PAGE IS NOT ACCESSIBLE TO ANYONE ELSE //

	// If key: user_id exists in the cookies
	if (request.cookies.user_id) {
		// Find the User by user_id in the Database & if found, then only render the profile page
		User.findById(request.cookies.user_id, (err, user) => {
			// If error in finding user
			if (err) {
				console.log("Error in finding user in profile");
				return;
			}
			// If user is found
			if (user) {
				return response.render("user_profile", {
					title: "User Profile",
					user: user,
				});
			}
			// If user is not found
			else {
				return response.redirect("/users/login");
			}
		});
	}
	// If key: user_id doesn't exist in the cookies
	else {
		return response.redirect("/users/login");
	}
};

//Export the Users Controller's signUp() Function
module.exports.signUp = (req, res) => {
	return res.render("user_sign_up", {
		title: "Sign Up",
	});
};

//Export the Users Controller's signIn() Function
module.exports.signIn = (req, res) => {
	res.clearCookie("user_id");
	return res.render("user_sign_in", {
		title: "Login",
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
