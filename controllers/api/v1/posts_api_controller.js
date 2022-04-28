module.exports.index = function (req, res) {
	return res.json(200, {
		message: "List of all the Posts",
		posts: [],
	});
};
