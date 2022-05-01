//Require the Passport Library
const passport = require("passport");
//Require the Passport Google OAuth2 Strategy
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
//Require the Crypto Library - for generating the random Passwords
const crypto = require("crypto");
//Require the User Model Data Structure Schema
const User = require("../models/user");
const { profile } = require("console");
//Require the Dotenv Library
const dotenv = require("dotenv").config();

//Tell Passport to use a new strategy for Google Login
passport.use(
	new googleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		(accessToken, refreshToken, profile, done) => {
			//Find the User in the Database
			User.findOne({ email: profile.emails[0].value }, (err, user) => {
				if (err) {
					console.log("Error in Google Strategy --> Passport");
					console.log("Error: ", err);
					return;
				}

				//User's Email can be multiple
				console.log(profile);

				if (user) {
					//Set req.user = Sign In that user
					//If user found in DB, set this user as req.user
					return done(null, user);
				} else {
					// If user not found in DB, create the user and set it as req.user
					User.create(
						{
							name: profile.displayName,
							email: profile.emails[0].value,
							password: crypto.randomBytes(20).toString("hex"),
						},
						(err, user) => {
							if (err) {
								console.log(
									"Error in creating the user --> Google Strategy Passport"
								);
								console.log("Error: ", err);
								return;
							}
							return done(null, user);
						}
					);
				}
			});
		}
	)
);

//Export the Passport Module
module.exports = passport;
