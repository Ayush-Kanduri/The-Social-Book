//Require the KUE module
const kue = require("kue");
//Create a new queue
const queue = kue.createQueue();

//Export the queue
module.exports = queue;
