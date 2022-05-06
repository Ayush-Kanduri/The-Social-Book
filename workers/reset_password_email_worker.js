//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Passwords Reset Mailer for sending the email
const passwordsResetMailer = require("../mailers/password_reset_mailer");

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
queue.process("passwordResetEmails", (job, done) => {
	// console.log("Password Reset Emails Worker is processing a Job: ", job.data);
	passwordsResetMailer.passwordReset(job.data);
	done();
});
