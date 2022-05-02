//Require the User Model Data Structure
const User = require("../../../models/user");
//Require JSON Web Token Module
const jwt = require("jsonwebtoken");

module.exports.index = async function (req, res) {
	try {
		let users = await User.find().sort("-createdAt").select("-password -__v");
		return res.status(200).json({
			message: "List of all the Users",
			data: {
				users: users,
			},
		});
	} catch (err) {
		return res.status(500).json({
			message: "Internal Server Error",
			data: {
				users: [],
			},
		});
	}
};

module.exports.createSession = async (req, res) => {
	//Whenever username and password is received, we need to create a JSON Web Token for that user.
	try {
		let user = await User.findOne({ email: req.body.email });

		if (!user || user.password !== req.body.password) {
			//Invalid Input
			return res.status(422).json({
				message: "Invalid Credentials !!!",
			});
		}

		return res.status(200).json({
			message: "Logged In Successfully !!!",
			data: {
				//We need to create a JSON Web Token for that user.
				//Signing the token with the secret key, JSON user object and the expiration time.
				token: jwt.sign(user.toJSON(), "TheSocialBook", {
					expiresIn: "10000",
					//"20" - 20 milliseconds
					//"20h" - 20 hours
					//"20d" - 20 days
					//"20m" - 20 minutes
					//"20s" - 20 seconds
				}),
				//user.toJSON() gets encrypted.
				message: "Here's your Token. Please Keep it safe !!!",
			},
		});
	} catch (err) {
		//Return the Error Response
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
