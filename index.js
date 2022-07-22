//----------------------------------------------------------------//
//Main Entry Point of the Express Server App//
//----------------------------------------------------------------//

//----------------------------------------------------------------//
//Basic Module/Library Imports//
//----------------------------------------------------------------//
//Require Express Module for running the Express Server
const express = require("express");
//Require the Environment File for getting the Environment Variables
const env = require("./config/environment");
//Require the DotEnv Library
const dotenv = require("dotenv").config();
//Require the CORS Module for allowing Cross-Origin Requests
const cors = require("cors");
//Require the Morgan Module for Logging
const logger = require("morgan");
//Create Express App for Request-Response Cycle & to create the Express Server
const app = express();
//Require the View Helpers
const viewHelpers = require("./config/view-helpers")(app);
//Create Express Server Port
const port = process.env.PORT || env.express_server_port;
//Require Path Module for the Directory
const path = require("path");
//Requires the index.js - Route File, from the Routes Folder.
const route = require("./routes/index");
//Require File System Module for the Directory
const fs = require("fs");
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
//Requires the Passport JWT Strategy used for the Authentication
const passportJWT = require("./config/passport-jwt-strategy");
//Requires the Passport Google Strategy used for the Authentication
const passportGoogle = require("./config/passport-google-oauth2-strategy");
//Requires the Passport Facebook Strategy used for the Authentication
// const passportFacebook = require("./config/passport-facebook-strategy");
//Requires the MongoStore
const MongoStore = require("connect-mongo");
//Requires the Node SASS Middleware Module
const sassMiddleware = require("node-sass-middleware");
//Requires the Connect Flash Module
const flash = require("connect-flash");
//Requires the Custom Middleware
const customMiddleware = require("./config/middleware");
//----------------------------------------------------------------//

//----------------------------------------------------------------//
//Setup the Chat Server to be used with Socket.io//
//----------------------------------------------------------------//
//Create Chat Server :: Require the HTTP Module for the Socket.io Server
const chatServer = require("http").Server(app);
//Create Chat Sockets for the Socket.io Server
const chatSockets = require("./config/chat_sockets").chatSockets(chatServer);
//Create Chat Server Port
const chatPort = env.chat_server_port;
//Run the Chat Server
chatServer.listen(chatPort);
//---------//
// console.log("Chat Server is Running Successfully on Port: " + chatPort);
//---------//
//----------------------------------------------------------------//

//----------------------------------------------------------------//
//Run Application Middlewares//
//----------------------------------------------------------------//
//Middleware - CORS
app.use(cors());
//We have to put SASS just before the server is starting, because the files should be pre-compiled before the server starts. Whenever templates/browser ask for it, these pre-compiled files will be served.
//Middleware - SASS Middleware
//SASS Middleware should only Run in Development Mode
if (env.name == "development") {
	app.use(
		sassMiddleware({
			//Where to look for the SASS files
			src: path.join(__dirname, env.asset_path, "scss"),
			//Where to put the compiled CSS files
			dest: path.join(__dirname, env.asset_path, "css"),
			//Reports error. If in production mode, set as false.
			// debug: true,
			debug: false,
			//The code should be in a single line - "compressed" or multiple lines - "expanded"
			outputStyle: "extended",
			//Prefix for the CSS files - where to look out for the css files in the assets folder
			prefix: "/css",
		})
	);
}
//Middleware - URL Encoder
app.use(express.urlencoded({ extended: true }));
//Middleware - JSON Encoder
app.use(express.json());
//Middleware - Cookie Parser for accessing the cookies
app.use(cookieParser());
//Middleware - Express App uses Static Files in the Assets Folder
app.use(express.static(env.asset_path));
//Middleware - Make the uploads path available to the browser
//** Server is not able to locate the file when the browser asks for it to show.
//** We need to create a route for it. This path/route should be available to the browser.
//** For the path/route - /uploads, find the folder using express.static(__dirname + "/uploads")
//** The directory of index.js + uploads folder, i.e, SOCIAL BOOK/uploads is available to the route - /uploads
app.use("/uploads", express.static(__dirname + "/uploads"));
//Middleware - Morgan used for Logging
app.use(logger(env.morgan.mode, env.morgan.options));
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
		secret: env.session_cookie_key,
		//Don't save the uninitialized session
		saveUninitialized: false,
		//Don't re-save the session if it is not modified
		resave: false,
		//Cookie Options
		cookie: {
			//Cookie Expiry Time - 100 Minutes
			maxAge: 1000 * 60 * 100,
		},
		//MongoStore is used to store the Session Cookies in the MongoDB
		store: MongoStore.create(
			{
				//DB Connection URL
				mongoUrl: `${env.db}`,
				//Interacts with the mongoose to connect to the MongoDB
				mongooseConnection: db,
				//To auto remove the store
				autoRemove: "disabled",
			},
			(err) => {
				//If there is an error
				if (err) {
					console.log(err || "connect-mongodb setup ok");
				}
			}
		),
	})
);
//Middleware - App should use PassportJS for the Authentication
app.use(passport.initialize());
//Middleware - PassportJS creates & maintains the Session
app.use(passport.session());
//Middleware - Sets the Authenticated User in the Response
app.use(passport.setAuthenticatedUser);
//Middleware - Uses the Flash Message just after the Session Cookie is set
app.use(flash());
//Middleware - Uses the Custom Middleware to set the Flash Message in the Response
app.use(customMiddleware.setFlash);
//Middleware - Creates Uploads Folder & Sub Folders, if not exists
app.use(customMiddleware.createUploads);
//Middleware - App calls index.js - Route File, whenever '/' route is called in the request.
app.use("/", route);
//----------------------------------------------------------------//

//----------------------------------------------------------------//
//Run the ExpressJS Server
//----------------------------------------------------------------//
app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is Up & Running Successfully on Port ${port}`);
});
//----------------------------------------------------------------//
