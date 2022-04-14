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
				//Send the form data to the server. Serialize() converts the form data into JSON.
				//KEY is content, VALUE is form filled data.
				data: newPostForm.serialize(),
				success: (data) => {
					let newPost = createPostInDOM(data.data.post);
					//Prepend appends the post to the top of the list, at first position.
					$("#posts-list-container>ul").prepend(newPost);
				},
				error: (error) => {
					console.log(error.responseText);
				},
			});
		});
	};

	//Method to create the post in DOM
	let createPostInDOM = (post) => {
		return $(`<li id="post-${post._id}">
				<p>
					<!-- We are the one creating the post, so we don't need if else for the user -->
					<small>
						<!-- post.id is String by MongoDB, post._id is Number -->
						<a class="delete-post-button" href="/posts/delete/${post.id}">X</a>
					</small>
					${post.content}
					<br />
					<small>${post.user.name}</small>
				</p>

				<div class="post-comments">
					<!-- We are already signed in, so we are only creating the post -->
					<form action="/comments/create" method="post">
						<textarea
							name="content"
							cols="20"
							rows="3"
							placeholder="Type Here To Add Comment ..."
						></textarea>
						<!-- Send ID of this specific Post where the Comment would be added  -->
						<input type="hidden" name="post" value="${post._id}" />
						<input type="submit" value="Add Comment" />
					</form>
					
					<div class="post-comments-list">
						<ul id="post-comments-${post._id}">
							<!-- We will append the comment when we need to -->
						</ul>
					</div>
				</div>
</li>`);
	};

	createPost();
}
