//Require the Mongoose Library
const mongoose = require("mongoose");
//Require the Environment File for getting the Environment Variables
const env = require("./environment");

//Connect to the Database
mongoose.connect(`mongodb://localhost/${env.db}`);

//Acquire the Connection
const db = mongoose.connection;

//If Error
db.on("error", console.error.bind(console, "Database Connection Error"));
//If Successful
db.once("open", () => {
	//---------//
	// console.log("Database Connected Successfully");
	//---------//
});

//Export the Connection
module.exports = db;
