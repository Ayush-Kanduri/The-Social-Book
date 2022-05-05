//Require the Queue from KUE
const { Job } = require("kue");
const queue = require("../config/kue");
//Require the Posts Mailer for sending the email
const postsMailer = require("../mailers/posts_mailer");

//Every Worker has a Process function, which tells the KUE(Queue) to run the function(Mailer) everytime a job is added to the queue.
queue.process("emails", (job, done) => {
	console.log("Post Emails Worker is processing a Job: ", job.data);
	postsMailer.newPost(job.data);
	done();
});
