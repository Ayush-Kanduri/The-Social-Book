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
