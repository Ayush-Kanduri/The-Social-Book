const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
	{
		//User who liked the post
		user: {
			type: mongoose.Schema.ObjectId,
		},
		//This defines the ObjectId of the Liked Object on which the Like has been placed.
		likeable: {
			type: mongoose.Schema.ObjectId,
			required: true,
			//Ref is Referencing to another collection/model.
			//RefPath is the field in the other collection/model that is being referenced.
			//RefPath is going to place the path to some other field which is there & that field is going to define on which type of object the like is placed.
			//onModel will be a property that will be defined on the likeable object.
			refPath: "onModel",
		},
		//This field defines the type of the Liked Object since this is a dynamic reference.
		onModel: {
			type: String,
			required: true,
			// A Likeable can be a Post or a Comment due to onModel
			enum: ["Post", "Comment"],
		},
	},
	{ timestamps: true }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
