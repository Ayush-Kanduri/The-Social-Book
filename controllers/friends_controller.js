//Require the User Model Data Structure
const User = require("../models/user");
//Require the Friendship Model Data Structure
const Friendship = require("../models/friendship");

//Export the Friends Controller's friends()
module.exports.friends = async (request, response) => {
	try {
		if (!request.user) {
			return response.redirect("/users/login");
		}
		let query = [
			{
				path: "to_user",
				select: "-password -__v",
			},
			{
				path: "from_user",
				select: "-password -__v",
			},
		];

		let user = await User.findById(request.user._id).populate({
			path: "friendships",
			populate: query,
		});

		friends = user.friendships;

		return response.render("friends_list", {
			title: "Friends List",
			friends,
		});
	} catch (err) {
		request.flash("error", err);
		return response.redirect("back");
	}
};

//Export the Friends Controller's toggleFriendship()
module.exports.toggleFriendship = async (request, response) => {
	try {
		if (!request.user) {
			return response.redirect("/users/login");
		}

		let param = request.params.id;
		let unfriended = false;

		let to_user = await User.findById(param);
		let from_user = request.user;

		//If the User sent the friend request
		let friendship = await Friendship.findOne({
			to_user: to_user._id,
			from_user: from_user._id,
		});

		//If the User received the friend request
		if (!friendship) {
			friendship = await Friendship.findOne({
				to_user: from_user._id,
				from_user: to_user._id,
			});
		}

		//If the friendship doesn't exist
		if (!friendship) {
			//Create a new friendship
			friendship = await Friendship.create({
				to_user,
				from_user,
			});

			from_user.friendships.push(friendship);
			to_user.friendships.push(friendship);
			await from_user.save();
			await to_user.save();
			unfriended = false;

			//---------//
			// console.log("Friendship Created");
			//---------//

			if (request.xhr) {
				return response.status(200).json({
					message: `${to_user.name} is now your Friend !!!`,
					data: {
						unfriended,
					},
				});
			}

			request.flash("success", `${to_user.name} is now your Friend !!!`);
			return response.redirect("back");
		}
		//If the friendship exists
		else {
			//Remove the friendship
			let friendshipID = friendship._id;
			let to_user_ID = friendship.to_user._id;
			let from_user_ID = friendship.from_user._id;

			await friendship.remove();
			await User.findByIdAndUpdate(to_user_ID, {
				$pull: { friendships: friendshipID },
			});
			await User.findByIdAndUpdate(from_user_ID, {
				$pull: { friendships: friendshipID },
			});
			unfriended = true;

			//---------//
			// console.log("Friendship Removed");
			//---------//

			if (request.xhr) {
				return response.status(200).json({
					message: "Friend Removed Successfully",
					data: {
						unfriended,
					},
				});
			}

			request.flash("success", "Friendship Ended !!!");
			return response.redirect("back");
		}
	} catch (err) {
		console.log(err);
		return response.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};

//Export the Friends Controller's removeFriend()
module.exports.removeFriend = async (request, response) => {
	try {
		if (!request.user) {
			return response.redirect("/users/login");
		}

		let friendship = await Friendship.findOne({
			to_user: request.user._id,
			from_user: request.params.id,
		});

		if (!friendship) {
			friendship = await Friendship.findOne({
				to_user: request.params.id,
				from_user: request.user._id,
			});
		}
		if (!friendship) {
			request.flash("error", "You are not friends with this user.");
			return response.redirect("back");
		}
		let friendshipID = friendship._id;
		let to_user_ID = friendship.to_user._id;
		let from_user_ID = friendship.from_user._id;

		await friendship.remove();
		await User.findByIdAndUpdate(to_user_ID, {
			$pull: { friendships: friendshipID },
		});
		await User.findByIdAndUpdate(from_user_ID, {
			$pull: { friendships: friendshipID },
		});

		let unfriended = true;

		return response.status(200).json({
			message: "Friend Removed Successfully",
			data: {
				unfriended,
			},
		});
	} catch (err) {
		console.log(err);
		return response.status(500).json({
			message: "Internal Server Error",
			error: err,
		});
	}
};
