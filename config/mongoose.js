const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/social_book_development");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database Connection Error"));
db.once("open", () => {
	console.log("Database Connected Successfully");
});

module.exports = db;
