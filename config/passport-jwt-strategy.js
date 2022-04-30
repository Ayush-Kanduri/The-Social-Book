//Require the Passport Library
const passport = require("passport");
//Require the Passport JWT Strategy
const JWTStrategy = require("passport-jwt").Strategy;
//Require the Module to extract JWT from the Header
const ExtractJWT = require("passport-jwt").ExtractJwt;
//Require the User Model Data Structure Schema
const User = require("../models/user");

//Header contains a list of items. Header has Authorization: Bearer: JWT Token
const options = {
	//Extract the JWT from the Header
	jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
	//The secret key used to sign the JWT
	secretOrKey: "TheSocialBook",
};

// Payload contains the information about the User.
passport.use(
	new JWTStrategy(options, (jwtPayload, done) => {
		//User is stored in the JWT Payload
		//Find the user specified in the JWT Token Payload
		User.findById(jwtPayload._id, (err, user) => {
			if (err) {
				console.log("Error in finding the user --> Passport");
				//Reports error to the PassportJS
				return done(err);
			}

			if (user) {
				//If the user is found, then the user is authenticated
				//It takes 2 arguments: 1st: Error, 2nd: User
				return done(null, user);
			} else {
				//If the user is not found, then the user is not authenticated
				//It takes 2 arguments: 1st: Error, 2nd: Authentication Status
				return done(null, false);
			}
		});
	})
);

//Export the Passport Module
module.exports = passport;

//The above process will fetch the token from the header and then decrypt it to fetch the user.
//Then it will check if the user is found in the database.
//-------------This is User Authentication Check-------------//
//It will be performed as a Passport Middleware before the API Routing.
