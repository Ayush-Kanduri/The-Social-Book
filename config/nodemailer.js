//Require the Nodemailer Module
const nodemailer = require("nodemailer");
//Require the EJS Module
const ejs = require("ejs");
//Require the Path Module
const path = require("path");

//Create a SMTP Transporter
let transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false, //For 2FA
	auth: {
		//To establish our Identity
		//SENDER'S EMAIL ADDRESS
		user: process.env.userEmail,
		pass: process.env.userPass,
	},
});

//To send the HTML Template Email
let renderTemplate = (data, relativePath) => {
	let mailHTML;
	ejs.renderFile(
		//Path to the EJS Template
		path.join(__dirname, "../views/mailers", relativePath),
		data,
		function (err, template) {
			if (err) {
				console.log("Error in rendering the template");
				return;
			}
			mailHTML = template;
		}
		//Data (Context) to be passed to the EJS Template
		//Relative Path is the place from where this function is being called.
	);
	return mailHTML;
};

module.exports = {
	transporter,
	renderTemplate,
};
