const express = require("express");
const app = express();
const port = 8000;

app.listen(port, (err) => {
	if (err) {
		console.log(err);
	}
	console.log(`Server is Up & Running Successfully on Port ${port}`);
});
