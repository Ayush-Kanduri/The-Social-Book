const { body } = require("express-validator");
const path = require("path");
const fs = require("fs");

//Create Uploads Folder if it doesn't exist
module.exports.createUploads = async (req, res, next) => {
	try {
		let directory = path.join(__dirname, "..", "/uploads");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users/avatars");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
		directory = path.join(__dirname, "..", "/uploads/users/posts");
		if (!fs.existsSync(directory)) fs.mkdirSync(directory);
	} catch (error) {
		console.log(error);
	}
	next();
};

//Sets the Flash Message into the Response Session
module.exports.setFlash = (req, res, next) => {
	res.locals.flash = {
		success: req.flash("success"),
		error: req.flash("error"),
	};
	next();
};

//Validates the Sign Up Form Data at the router level before sending it to the Database
module.exports.validate = (method) => {
	switch (method) {
		case "createUser": {
			return [
				body("email", "Invalid Email").exists().isEmail(),
				body("password", "Password should be at least 6 Characters Long")
					.exists()
					.isLength({ min: 6 }),
				body("name", "Name must be at least 2 Characters Long")
					.exists()
					.isLength({ min: 2 }),
				body("avatar").optional(),
			];
		}
	}
};
