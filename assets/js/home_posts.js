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
					let newPost = createPostInDOM(data.data.post, data.data.user);
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
						timeout: 3000,
					}).show();
				},
				error: (error) => {
					console.log(error.responseText);
				},
			});
		});
	};

	//Method to create the post in DOM
	let createPostInDOM = (post, user) => {
		let postImage, postVideo, postUserAvatar, userAvatar;

		if (user.avatar) {
			userAvatar = `<img
							class="user-avatar create-post-avatar"
							src="${user.avatar}"
							alt="${user.name}"
							onclick="window.location.href='/users/profile/${user._id}'"
							onerror="this.onerror=null; this.src='/images/empty-avatar.png'"
							loading="lazy"
						/>`;
		} else {
			userAvatar = `<img
							class="user-avatar create-post-avatar"
							src="/images/empty-avatar.png"
							alt="${user.name}"
							onclick="window.location.href='/users/profile/${user._id}'"
							onerror="this.onerror=null; this.src='/images/empty-avatar.png'"
							loading="lazy"
						/>`;
		}

		if (post.postImage) {
			postImage = `<img
							src=""
							data-src="${post.postImage}"
							alt="alt-post-image"
							loading="lazy"
							/>`;
		} else {
			postImage = "";
		}

		if (post.postVideo) {
			postVideo = `<video src="${post.postVideo}" alt="alt-post-video" controls />`;
		} else {
			postVideo = "";
		}

		if (post.user.avatar) {
			postUserAvatar = `<img
								class="user-avatar"
								src="${post.user.avatar}"
								alt="${post.user.name}"
								onclick="window.location.href='/users/profile/${post.user._id}'"
								loading="lazy"
							/>`;
		} else {
			postUserAvatar = `<img
								class="user-avatar"
								src="/images/empty-avatar.png"
								alt="${post.user.name}"
								onclick="window.location.href='/users/profile/${post.user._id}'"
								loading="lazy"
							/>`;
		}

		return $(`<li id="post-${post._id}" class="card post-li">
	<div class="post">
		<div class="post-heading">
			${postUserAvatar}
			<p class="post-info">
				<small
					onclick="window.location.href='/users/profile/${post.user._id}'"
					>${post.user.name}</small
				>
				<small>${printPostDate(post.updatedAt)}</small>
			</p>

			<!-- We are the one creating the post, so we don't need if else for the user -->
			<small>
				<!-- post.id is String by MongoDB, post._id is Number -->
				<a class="delete-post-button" href="/posts/delete/${post._id}"
					><i class="fa-solid fa-trash"></i
				></a>
			</small>
		</div>
		<div class="post-content">
			<p>${post.content}</p>
			${postImage}
			${postVideo}
		</div>
		<div class="post-react">
			<a href="#/" class="like"
				><i class="fa-solid fa-thumbs-up"></i>&ensp;Like</a
			>
			<a href="#/" class="comment"
				><i class="fa-solid fa-message"></i>&ensp;Comment</a
			>
			<a href="#/" class="share"
				><i class="fa-solid fa-share"></i>&ensp;Share</a
			>
		</div>
	</div>
	<div class="post-comments">
		<!-- We are already signed in, so we are only creating the post -->
		<form
			action="/comments/create"
			id="post-${post._id}-comments-form"
			method="post"
		>
			${userAvatar}
			<textarea
				name="content"
				cols="30"
				rows="3"
				placeholder="Type Here To Add Comment ..."
			></textarea>
			<!-- Send ID of this specific Post where the Comment would be added  -->
			<input type="hidden" name="post" value="${post._id}" />
			<input class="btn-grad" type="submit" value="Add Comment" />
		</form>
		<div class="post-comments-list">
			<ul id="post-comments-${post._id}" class="post-comments-ul">
				<!-- We will append the comment when we need to -->
			</ul>
		</div>
	</div>
</li>
`);
	};

	//Method to set the date on which the post was created in the correct format.
	function printPostDate(dat) {
		let date = dat;
		date = new Date(date);
		const day = date.getDate();
		const year = date.getFullYear();
		const monthWord = date.toLocaleString("default", {
			month: "short",
		});
		const time = date.toLocaleTimeString("default", {
			hour: "2-digit",
			minute: "2-digit",
		});
		const today = day + " " + monthWord + ", " + year;
		const format = today + " | " + time;
		return format;
	}

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
						timeout: 3000,
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
