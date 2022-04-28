module.exports.index = function (req, res) {
	return res.json(200, {
		greeting: "Welcome to the API",
		message: "List of all the Posts",
		posts: [],
		users: [],
	});
};
