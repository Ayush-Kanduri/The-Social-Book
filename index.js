//----------------------------------------------------------------//
//Main Entry Point of the Express Server App//
//----------------------------------------------------------------//
//Require Express Module for running the Express Server
const express = require("express");
//Create Express App for Request-Response Cycle & to create the Express Server
const app = express();
//Create Port
const port = 8000;
//Require Path Module for the Directory
const path = require("path");
//Requires the index.js - Route File, from the Routes Folder.
const route = require("./routes/index");
//Requires Express-EJS-Layouts Module
const expressLayouts = require("express-ejs-layouts");
//Requires MongoDB
const db = require("./config/mongoose");
//Requires the Cookie-Parser Module
const cookieParser = require("cookie-parser");
//Requires the Express-Session Module for the Session Cookie
const session = require("express-session");
//Requires the PassportJS Module for the Authentication
const passport = require("passport");
//Requires the Passport Local Strategy used for the Authentication
const passportLocal = require("./config/passport-local-strategy");

//Middleware - URL Encoder
app.use(express.urlencoded({ extended: true }));
//Middleware - Cookie Parser for accessing the cookies
app.use(cookieParser());
//Middleware - Express App uses Static Files in the Assets Folder
app.use(express.static("./assets"));
//Middleware - Express App uses expressLayouts to tell that the views which are going to be rendered belongs to some layout.
app.use(expressLayouts);

//Set Up - Extract Styles and Scripts from Sub Pages into the Layout.
app.set("layout extractStyles", true);
//Set Up - Extract Styles and Scripts from Sub Pages into the Layout.
app.set("layout extractScripts", true);
//Set Up - Template Engine as EJS
app.set("view engine", "ejs");
//Set Up - Template Engine Views Folder Path (..../views)
app.set("views", path.join(__dirname, "views"));

//Middleware - Takes the Session Cookie and Encrypts it with a Key
app.use(
	session({
		//Cookie Name
		name: "socialBook",
		//Secret Key for encrypting the session cookie
		//** TODO - Change the Secret Key before Deployment in Production Mode **//
		secret: "social_book",
		saveUninitialized: false,
		resave: false,
		//Cookie Options
		cookie: {
			//Cookie Expiry Time - 100 Minutes
			maxAge: 1000 * 60 * 100,
		},
	})
);
//Middleware - App should use PassportJS for the Authentication
app.use(passport.initialize());
//Middleware - PassportJS creates & maintains the Session
app.use(passport.session());
//Middleware - App calls index.js - Route File, whenever '/' route is called in the request.
app.use("/", route);

//Run the ExpressJS Server
app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server is Up & Running Successfully on Port ${port}`);
});
