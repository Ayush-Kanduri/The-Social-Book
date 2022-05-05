//Require the Passport Library
const passport = require("passport");
//Require the Passport Google OAuth2 Strategy
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
//Require the Crypto Library - for generating the random Passwords
const crypto = require("crypto");
//Require the User Model Data Structure Schema
const User = require("../models/user");
//Require the Dotenv Library
const dotenv = require("dotenv").config();
//Require the Users Mailer
const usersMailer = require("../mailers/users_mailer");
//Require the Queue from KUE
const queue = require("../config/kue");
//Require the User Creation Email Worker
const userCreationEmailWorker = require("../workers/userCreation_email_worker");

//Tell Passport to use a new strategy for Google Login
passport.use(
	new googleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		(accessToken, refreshToken, profile, done) => {
			//User's Email can be multiple
			//Find the User in the Database
			User.findOne({ email: profile.emails[0].value }, (err, user) => {
				if (err) {
					console.log("Error in Google Strategy --> Passport");
					console.log("Error: ", err);
					return;
				}

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
							avatar: !!profile.photos[0].value
								? profile.photos[0].value
								: "",
						},
						async (err, user) => {
							if (err) {
								console.log(
									"Error in creating the user --> Google Strategy Passport"
								);
								console.log("Error: ", err);
								return;
							}

							//Populating the user with the required information.
							let newUser = await user.populate("name email");

							// ------------------------------------------------------------------
							//Sending that user to the mailer.
							// usersMailer.newUser(newUser);
							// ------------------------------------------------------------------

							//Parallel Job / Delayed Job for the User Creation Email Worker
							let job = queue.create("emails", newUser).save((err) => {
								if (err) {
									console.log(
										"Error in adding the Job to the Queue: ",
										err
									);
									return;
								}
								console.log("Job Added to the Queue: ", job.id);
							});

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
