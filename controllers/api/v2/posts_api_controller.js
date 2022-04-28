module.exports.index = function (req, res) {
	return res.status(200).json({
		greeting: "Welcome to the API",
		message: "List of all the Posts",
		posts: [],
		users: [],
	});
};
