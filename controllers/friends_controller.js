//Require the User Model Data Structure
const User = require("../models/user");

//Export the Friends Controller's friends()
module.exports.friends = async (request, response) => {
	try {
		let users = await User.find({});
		return response.render("friends_list", {
			title: "Friends List",
			friends: users,
		});
	} catch (err) {
		console.log("Error: ", err);
		return;
	}
};
