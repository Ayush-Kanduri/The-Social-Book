//Require the Passport Library
const passport = require("passport");
//Require the Passport Facebook Strategy
const facebookStrategy = require("passport-facebook").Strategy;
//Require the Crypto Library - for generating the random Passwords
const crypto = require("crypto");
//Require the User Model Data Structure Schema
const User = require("../models/user");
//Require the Dotenv Library
const dotenv = require("dotenv").config();
//Require the Environment File for the Environment Variables
const env = require("./environment");

//Tell Passport to use a new strategy for Facebook Login
passport.use(
	new facebookStrategy(
		{
			clientID: env.facebook_client_id,
			clientSecret: env.facebook_client_secret,
			callbackURL: env.facebook_callback_url,
			profileFields: ["displayName", "photos", "email"],
		},
		(accessToken, refreshToken, profile, done) => {
			//---------//
			// console.log(profile);
			//---------//
			//Find the User in the Database
			User.findOne({ email: profile.emails[0].value }, (err, user) => {
				if (err) {
					console.log("Error in Facebook Strategy --> Passport");
					console.log("Error: ", err);
					return;
				}

				if (user) {
					//If user found in DB, set this user as req.user
					return done(null, user);
				} else {
					// If user not found in DB, create the user and set it as req.user
					User.create(
						{
							name: profile.displayName,
							email: profile.emails[0].value,
							password: crypto.randomBytes(20).toString("hex"),
							avatar: !!profile.photos[0].value
								? profile.photos[0].value
								: "",
						},
						(err, user) => {
							if (err) {
								console.log(
									"Error in creating the user --> Facebook Strategy Passport"
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
