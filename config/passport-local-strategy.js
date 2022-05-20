//Require the Passport Library
const passport = require("passport");

//--LocalStrategy should be Capitalized--//
//Require the Passport Local Strategy
const LocalStrategy = require("passport-local").Strategy;

//Require the User Model Data Structure Schema
const User = require("../models/user");

//-------------------------------------------------------------------------------------//
//----------------------------------------------------------------------//
//Before the User is found & Authenticated//
//----------------------------------------------------------------------//

//---------------------------//
//Browser ---> Server Request//
//---------------------------//
//--Authentication using PassportJS--//
//PassportJS will use the Local Strategy function() to find the User who has signed in
passport.use(
	new LocalStrategy(
		{
			//email [DB]
			usernameField: "email",
			passReqToCallback: true,
		},
		(req, email, password, done) => {
			//done is a callback function. It is called when the user is authenticated or not authenticated

			//Find the user & establish the identity
			//  email [DB]: email [req.body]  //
			User.findOne({ email: email }, (err, user) => {
				if (err) {
					console.log("Error in finding the user --> Passport");
					req.flash("error", err);
					//Reports error to the PassportJS
					return done(err);
				}

				if (!user || user.password !== password) {
					//---------//
					// console.log("Invalid Credentials");
					//---------//
					req.flash("error", "Invalid Credentials");
					//There's no error but the user is not found or the password is incorrect, i.e, Authentication Failed.
					//It takes 2 arguments: 1st: Error, 2nd: Authentication Status
					return done(null, false);
				}

				//If the user is found and the password is correct, then the user is authenticated
				//It takes 2 arguments: 1st: Error, 2nd: User
				return done(null, user);
			});
		}
	)
);
//-------------------------------------------------------------------------------------//
//----------------------------------------------------------------------//
//After the User is found & Authenticated//
//----------------------------------------------------------------------//

//----------------------------//
//Server ---> Browser Response//
//----------------------------//
//--Serializing the User to decide which key is to be kept in the cookies--//
passport.serializeUser((user, done) => {
	//It automatically encrypts the User ID into the cookie, & sends it to the browser
	done(null, user.id);
});

//----------------------------------//
//NEXT: Browser ---> Server Request//
//---------------------------------//
//--Deserializing the User from the key in the cookies--//
passport.deserializeUser((id, done) => {
	//When the browser makes the Request to the Server next time, it automatically decrypts the User ID from the cookie, & finds the user in the database
	User.findById(id, (err, user) => {
		if (err) {
			console.log("Error in finding the user --> Passport");
			return done(err);
		}

		return done(null, user);
	});
});
//-------------------------------------------------------------------------------------//
// ** Check if the user is Authenticated ** //
//Creating a middleware in passport.js
passport.checkAuthentication = function (req, res, next) {
	//If the user is signed in then pass on the request to the next function(controller's action) & let them have the profile page
	if (req.isAuthenticated()) {
		//---------//
		// console.log(
		// 	"[User is Logged In & Authenticated] ---> Access Granted to Profile"
		// );
		//---------//
		return next();
	}
	//If the user is not signed in, then redirect them back to the Login page
	return res.redirect("/users/login");
};

// ** Set the Authenticated User ** //
//Creating a middleware in passport.js
passport.setAuthenticatedUser = function (req, res, next) {
	//Whenever a user is signed in, that user's info is available in req.user because of the passport & User Model
	if (req.isAuthenticated()) {
		//req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
		res.locals.user = req.user;
		//---------//
		// console.log(req.user._id);
		// console.log("[Authenticated User is Set in the Response Object] ");
		//---------//
	}
	next();
};

//Export the Passport Module
module.exports = passport;
