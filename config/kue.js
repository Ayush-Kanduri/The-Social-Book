//Require the KUE module
const kue = require("kue");
//Require the Environment variables
const env = require("./environment");

//Create a new Queue
let queue = "";

//queue = kue.createQueue({redis: {port: 6379,host: "localhost",auth: ""}});
if (env.name === "development" && env.deployment === "local") {
	queue = kue.createQueue();
} else if (env.name === "production" && env.deployment === "local") {
	queue = kue.createQueue();
} else if (env.name === "production" && env.deployment === "AWS") {
	queue = kue.createQueue();
} else if (env.name === "production" && env.deployment === "Heroku") {
	queue = kue.createQueue({
		prefix: "q",
		redis: {
			port: env.redis_port,
			host: env.redis_host,
			auth: env.redis_auth,
		},
	});
} else if (env.name === "production" && env.deployment === "other") {
	queue = kue.createQueue({
		prefix: "q",
		redis: {
			port: env.redis_port,
			host: env.redis_host,
			auth: env.redis_auth,
		},
	});
}

//Export the queue
module.exports = queue;
