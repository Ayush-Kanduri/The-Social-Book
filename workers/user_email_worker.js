//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Users Mailer for sending the email
const usersMailer = require("../mailers/users_mailer");

//A Worker can have Multiple Queues

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
queue.process("userCreationEmails", (job, done) => {
	// console.log("User Creation Emails Worker is processing a Job: ", job.data);
	usersMailer.newUser(job.data);
	done();
});

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
queue.process("userUpdationEmails", (job, done) => {
	// console.log("User Updation Emails Worker is processing a Job: ", job.data);
	usersMailer.updateUser(job.data);
	done();
});
