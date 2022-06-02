const env = require("./environment");
const fs = require("fs");
const path = require("path");

//A Global Function which will be present in the App. It will take an App as an argument because we are sending the function to the Locals of the App. It will receive an Express App Instance.
module.exports = (app) => {
	app.locals.assetPath = (filePath) => {
		if (env.name === "development") {
			return "/" + filePath;
		}

		//Parsing the JSON Manifest File & Synchronized reading of it.
		return (
			"/" +
			JSON.parse(
				fs.readFileSync(
					path.join(__dirname, "../public/assets/rev-manifest.json")
				)
			)[filePath]
		);
	};
};
