//Require the Mongoose Library
const mongoose = require("mongoose");

//Connect to the Database
mongoose.connect("mongodb://localhost/social_book_development");

//Acquire the Connection
const db = mongoose.connection;

//If Error
db.on("error", console.error.bind(console, "Database Connection Error"));
//If Successful
db.once("open", () => {
	console.log("Database Connected Successfully");
});

//Export the Connection
module.exports = db;
