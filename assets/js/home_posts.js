//For Block Scope
//jQuery AJAX//
{
	//Method to submit the form for new post using jQuery AJAX
	let createPost = () => {
		let newPostForm = $("#new-post-form");
		newPostForm.submit((event) => {
			event.preventDefault();
			$.ajax({
				type: "POST",
				url: "/posts/create",
				//Send the form data to the server
				//Serialize() converts the form data into JSON
				//KEY is content, VALUE is form filled data
				data: newPostForm.serialize(),
				success: (data) => {
					console.log(data);
				},
				error: (error) => {
					console.log(error.responseText);
				},
			});
		});
	};

	//Method to create the post in DOM

	createPost();
}
