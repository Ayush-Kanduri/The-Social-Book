//Require the User Model Data Structure
const User = require("../models/user");
//Require the Express validator
const { validationResult } = require("express-validator");
//Require File System Module for the Directory
const fs = require("fs");
//Require Path Module for the Directory
const path = require("path");

//Export the Users Controller's profile() Function
module.exports.profile = (request, response) => {
	// return response.end("<h1>Users Profile</h1>");
	User.findById(request.params.id, (err, user) => {
		if (err) {
			console.log("Error in finding user in profile");
			request.flash("error", "Error in finding user in profile");
			return response.redirect("back");
		}
		return response.render("user_profile", {
			title: "User Profile",
			profile_user: user,
		});
	});
};

//Export the Users Controller's update() Function
module.exports.update = async (req, res) => {
	//If user is the same as the user who is logged in
	if (req.params.id == req.user.id) {
		try {
			//Find the User by the ID
			let user = await User.findById(req.params.id);
			//Now we can't access the body params in the form directly from req.params because it is a Multipart Form & body parser cannot parse it.

			//Call User static method to upload the Profile Picture
			User.uploadedAvatar(req, res, (err) => {
				if (err) {
					console.log("Error in MULTER: ", err);
					return res.redirect("back");
				}

				//Set Name & Email
				user.name = req.body.name;
				user.email = req.body.email;
				user.password = req.body.password;

				//If Incoming File Exists
				if (req.file) {
					//user.avatar ==> /uploads/users/avatars/filename
					//User.avatarPath ==> /uploads/users/avatars
					//If User Avatar already exists in the Database
					if (user.avatar) {
						//If User Avatar already exists in the "/uploads/users/avatars" Directory
						if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
							//Delete that Old Avatar
							fs.unlinkSync(path.join(__dirname, "..", user.avatar));
						}
					}

					//Save the New Avatar
					//Saving the path of the uploaded file into the avatar field of the user
					user.avatar = User.avatarPath + "/" + req.file.filename;
				}
				//Save the User
				user.save();

				req.flash("success", "Profile Updated !!!");
				return res.redirect("back");
			});
		} catch (err) {
			req.flash("error", err);
			return res.redirect("back");
		}
	} else {
		req.flash("error", "Unauthorized !!!");
		return res.status(401).send("Unauthorized");
	}
};

//Export the Users Controller's signUp() Function
module.exports.signUp = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}
	return res.render("user_sign_up", {
		title: "Sign Up",
	});
};

//Export the Users Controller's signIn() Function
module.exports.signIn = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect("/users/profile");
	}
	return res.render("user_sign_in", {
		title: "Login",
	});
};

//Export the Users Controller's createUser() Function
module.exports.createUser = (req, res) => {
	// Finds the validation errors in this request and wraps them in an object with handy functions
	const errors = validationResult(req);

	//If there are Errors in the Validation of the Form
	if (!errors.isEmpty()) {
		// res.status(422).json({ errors: errors.array() });
		const error = errors.array();
		return res.render("user_sign_up", {
			flash: {
				error: error[0].msg,
			},
			title: "Sign Up",
		});
	}

	//Custom Back End Form Validation
	if (req.body.password !== req.body.confirm_password) {
		req.flash("error", "Password didn't match !!!");
		return res.redirect("back");
	}

	User.findOne({ email: req.body.email }, (err, user) => {
		if (err) {
			req.flash("error", err);
			return res.redirect("back");
		}

		if (!user) {
			User.create(req.body, (err, user) => {
				//Transporting the error from the Schema to here.
				if (err) {
					let error = "Error in creating user while signing up !!!";
					if (err.message) {
						let i = err.message.lastIndexOf(":");
						error = err.message.substr(i + 2);
					}
					req.flash(
						"error",
						error || "Error in creating user while signing up !!!"
					);
					return res.redirect("back");
				}

				req.flash("success", "User created !!!");
				return res.redirect("/users/login");
			});
		} else {
			req.flash("error", "User already exists !!!");
			return res.redirect("back");
		}
	});
};

//Export the Users Controller's createSession() Function
module.exports.createSession = (req, res) => {
	//User is Signed In & we need to redirect to the Home Page
	req.flash("success", "Logged In Successfully !!!");
	return res.redirect("/");
};

//Export the Users Controller's destroySession() Function
module.exports.destroySession = (req, res) => {
	//PassportJS provides logout() Function to the Request Object
	//User is Signed Out & redirected to the Home Page
	req.logout();
	req.flash("success", "Logged Out Successfully !!!");
	return res.redirect("/");
};
