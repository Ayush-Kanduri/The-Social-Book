//Require the Queue from KUE
const queue = require("../config/kue");
//Require the Comments Mailer for sending the email
const commentsMailer = require("../mailers/comments_mailer");

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
//The Job is an object that contains the Data that was added into the queue.
//Data is the comment object which needs to be sent to the user via mail.
queue.process("emails", (job, done) => {
	console.log("Comment Emails Worker is processing a Job: ", job.data);
	commentsMailer.newComment(job.data);
	done();
});
