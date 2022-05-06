//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const resetPasswordTokenSchema = new mongoose.Schema(
	{
		//Reset Password Access Token
		access_token: {
			type: String,
			required: true,
		},
		//Reset Password Access Token Expiry
		isValid: {
			type: Boolean,
			default: true,
		},
		//Access Token belongs to a user, referenced by the User Model
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		expire_at: {
			type: Date,
			default: Date.now,
			expires: 7200,
		},
	},
	{ timestamps: true }
);

resetPasswordTokenSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const ResetPasswordToken = mongoose.model(
	"ResetPasswordToken",
	resetPasswordTokenSchema
);

//Export the Model/Collection
module.exports = ResetPasswordToken;
