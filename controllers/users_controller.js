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
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}
	return res.render("user_sign_up", {
		title: "Social Book | Sign Up",
	});
};

//Export the Users Controller's signIn() Function
module.exports.signIn = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}
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
				console.log("User created");
				return res.redirect("/users/login");
			});
		} else {
			return res.redirect("back");
		}
	});
};

//Export the Users Controller's createSession() Function
module.exports.createSession = (req, res) => {
	console.log("User Logged In & Authenticated");
	//User is Signed In & we need to redirect to the Home Page
	return res.redirect("/");
};

//Export the Users Controller's destroySession() Function
module.exports.destroySession = (req, res) => {
	//PassportJS provides logout() Function to the Request Object
	req.logout();
	console.log("User Logged Out & De-Authenticated");
	//User is Signed Out & redirected to the Home Page
	return res.redirect("/");
};
