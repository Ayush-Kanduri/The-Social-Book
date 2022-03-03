//------------Main Entry Point of the Express Server App------------//

const express = require("express");
const app = express();
const port = 8000;

//Requires the index.js - Route File, from the Routes Folder.
const route = require("./routes/index");
//Middleware - App calls index.js - Route File, whenever '/' route is called in the request.
app.use("/", route);

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server is Up & Running Successfully on Port ${port}`);
});
