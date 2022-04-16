//For Block Scope
//jQuery AJAX//
{
	//Method to submit the form for new post using jQuery AJAX
	let createPost = () => {
		let newPostForm = $("#new-post-form");
		newPostForm.submit((event) => {
			event.preventDefault();

			//Sends the request to the server (/posts/create) to create the post via jQuery AJAX.
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
					//Clear the form after submission.
					newPostForm.trigger("reset");
					//Extracts delete button from the post & calls the deletePost() method with it.
					deletePostFromDOM($(" .delete-post-button", newPost));
					// call the create comment class
					new PostComments(data.data.post._id);
					//Calls Noty() to display the success message.
					new Noty({
						theme: "relax",
						text: "Post Published !!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
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
						<a class="delete-post-button" href="/posts/delete/${post._id}">X</a>
					</small>
					${post.content}
					<br />
					<small>${post.user.name}</small>
				</p>

				<div class="post-comments">
					<!-- We are already signed in, so we are only creating the post -->
					<form action="/comments/create" method="post" id="post-${post._id}-comments-form">
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

	//Method to delete the post from DOM - This function attaches Click Event Listener to the Delete Post Button & sends the AJAX request to the server.
	let deletePostFromDOM = (deleteLink) => {
		$(deleteLink).click((event) => {
			event.preventDefault();

			//Sends the request to the server (/posts/delete/post.id) to delete the post via jQuery AJAX parallelly.
			//When it sends, it receives a data object with the post id from the posts controller destroy().
			$.ajax({
				type: "GET",
				url: $(deleteLink).prop("href"),
				success: (data) => {
					//Removes the post from the DOM.
					$(`#post-${data.data.post_id}`).remove();
					//Calls Noty() to display the success message.
					new Noty({
						theme: "relax",
						text: "Post Deleted !!!",
						type: "success",
						layout: "topRight",
						timeout: 1500,
					}).show();
				},
				error: (error) => {
					console.log("Error: ", error.responseText);
				},
			});
		});
	};

	// loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
	let convertPostsToAjax = function () {
		$("#posts-list-container>ul>li").each(function () {
			let self = $(this);
			let deleteButton = $(" .delete-post-button", self);
			deletePostFromDOM(deleteButton);

			// get the post's id by splitting the id attribute
			let postId = self.prop("id").split("-")[1];
			new PostComments(postId);
		});
	};

	createPost();
	convertPostsToAjax();
}
