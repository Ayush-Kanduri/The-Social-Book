//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Users Mailer for sending the email
const usersMailer = require("../mailers/users_mailer");

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
queue.process("emails", (job, done) => {
	console.log("User Creation Emails Worker is processing a Job: ", job.data);
	usersMailer.newUser(job.data);
	done();
});
