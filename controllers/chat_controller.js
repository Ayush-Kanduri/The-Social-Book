const User = require("../models/user");
const Chat = require("../models/chat");

module.exports.chatting = async function (req, res) {
    if (!req.user) {
        return res.redirect("/users/login");
    }
    const user = await User.findOne({email: req.body.user_email});
    console.log(req.body);
};
