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
//Require the User Email Worker
const userEmailWorker = require("../workers/user_email_worker");
//Require the Environment File for the Environment Variables
const env = require("./environment");

//Tell Passport to use a new strategy for Google Login
passport.use(
	new googleStrategy(
		{
			clientID: env.google_client_id,
			clientSecret: env.google_client_secret,
			callbackURL: env.google_callback_url,
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
							// avatar: !!profile.photos[0].value
							// 	? `${profile.photos[0].value}?`
							// 	: "",
							avatar:
								"https://raw.githubusercontent.com/Ayush-Kanduri/Social-Book_Social_Media_Website/master/assets/images/empty-avatar.png",
						},
						(err, user) => {
							if (err) {
								console.log(
									"Error in creating the user --> Google Strategy Passport"
								);
								console.log("Error: ", err);
								return;
							}

							//Populating the user with the required information.
							let newUser = {
								name: user.name,
								email: user.email,
							};

							// ------------------------------------------------------------------
							//Sending that user to the mailer.
							// usersMailer.newUser(newUser);
							// ------------------------------------------------------------------

							//Parallel Job / Delayed Job for the User Worker
							let job = queue
								.create("userCreationEmails", newUser)
								.save((err) => {
									if (err) {
										console.log(
											"Error in adding the Job to the Queue: ",
											err
										);
										return;
									}
									//---------//
									// console.log("Job Added to the Queue: ", job.id);
									//---------//
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
