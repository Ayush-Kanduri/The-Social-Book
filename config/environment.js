//Require the Dotenv Library
const dotenv = require("dotenv").config();
//Require Path Module for the Directory
const path = require("path");
//Require File System Module for the Directory
const fs = require("fs");
//Require the Rotating File Stream Module for Logging
const rfs = require("rotating-file-stream");

//Log Directory
const logDirectory = path.join(__dirname, "../production_logs");
//Ensure Log Directory exists, if not, Create it
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
//User is accessing our Website, so, Access Log Stream
const accessLogStream = rfs.createStream("access.log", {
	interval: "1d",
	path: logDirectory,
});

//Development Environment
const development = {
	name: "development",
	asset_path: process.env.TSB_DEVELOPMENT_ASSET_PATH,
	session_cookie_key: process.env.TSB_DEVELOPMENT_SESSION_COOKIE_KEY,
	db: process.env.TSB_DEVELOPMENT_DB,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false, //For 2FA
		auth: {
			//To establish our Identity
			//SENDER'S EMAIL ADDRESS
			user: process.env.TSB_DEVELOPMENT_USER_EMAIL,
			pass: process.env.TSB_DEVELOPMENT_USER_PASS,
		},
	},
	google_client_id: process.env.TSB_DEVELOPMENT_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.TSB_DEVELOPMENT_GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.TSB_DEVELOPMENT_GOOGLE_CALLBACK_URL,
	facebook_client_id: process.env.TSB_DEVELOPMENT_FACEBOOK_CLIENT_ID,
	facebook_client_secret: process.env.TSB_DEVELOPMENT_FACEBOOK_CLIENT_SECRET,
	facebook_callback_url: process.env.TSB_DEVELOPMENT_FACEBOOK_CALLBACK_URL,
	jwt_secret: process.env.TSB_DEVELOPMENT_JWT_SECRET,
	google_maps_api_key: process.env.TSB_DEVELOPMENT_GOOGLE_MAPS_API_KEY,
	express_server_port: process.env.TSB_DEVELOPMENT_EXPRESS_SERVER_PORT,
	chat_server_port: process.env.TSB_DEVELOPMENT_CHAT_SERVER_PORT,
	email_sender: process.env.TSB_DEVELOPMENT_FROM_EMAIL,
	morgan: {
		mode: "dev",
		options: {
			stream: accessLogStream,
		},
	},
};

//Production Environment
const production = {
	name: "production",
	asset_path: process.env.TSB_ASSET_PATH,
	session_cookie_key: process.env.TSB_SESSION_COOKIE_KEY,
	db: process.env.TSB_DB,
	smtp: {
		service: "gmail",
		host: "smtp.gmail.com",
		port: 587,
		secure: false, //For 2FA
		auth: {
			//To establish our Identity
			//SENDER'S EMAIL ADDRESS
			user: process.env.TSB_USER_EMAIL,
			pass: process.env.TSB_USER_PASS,
		},
	},
	google_client_id: process.env.TSB_GOOGLE_CLIENT_ID,
	google_client_secret: process.env.TSB_GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.TSB_GOOGLE_CALLBACK_URL,
	facebook_client_id: process.env.TSB_FACEBOOK_CLIENT_ID,
	facebook_client_secret: process.env.TSB_FACEBOOK_CLIENT_SECRET,
	facebook_callback_url: process.env.TSB_FACEBOOK_CALLBACK_URL,
	jwt_secret: process.env.TSB_JWT_SECRET,
	google_maps_api_key: process.env.TSB_GOOGLE_MAPS_API_KEY,
	express_server_port: process.env.TSB_EXPRESS_SERVER_PORT,
	chat_server_port: process.env.TSB_CHAT_SERVER_PORT,
	email_sender: process.env.TSB_FROM_EMAIL,
	morgan: {
		mode: "combined",
		options: {
			stream: accessLogStream,
		},
	},
};

// module.exports = development;

module.exports =
	eval(process.env.TSB_ENVIRONMENT) == undefined
		? development
		: eval(process.env.TSB_ENVIRONMENT);

// module.exports =
// 	eval(process.env.NODE_ENV) == undefined
// 		? development
// 		: eval(process.env.NODE_ENV);
