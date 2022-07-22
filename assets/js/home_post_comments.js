// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments {
	// constructor is used to initialize the instance of the class whenever a new instance is created
	constructor(postId) {
		this.postId = postId;
		this.postContainer = $(`#post-${postId}`);
		this.newCommentForm = $(`#post-${postId}-comments-form`);

		this.createComment(postId);

		let self = this;
		// call for all the existing comments
		$(" .delete-comment-button", this.postContainer).each(function () {
			self.deleteComment($(this));
		});
	}

	createComment(postId) {
		let pSelf = this;
		this.newCommentForm.submit(function (e) {
			e.preventDefault();

			let self = this;

			$.ajax({
				type: "POST",
				url: "/comments/create",
				data: $(self).serialize(),
				success: function (data) {
					let newComment = pSelf.newCommentDom(
						data.data.comment,
						data.data.user
					);
					$(`#post-comments-${postId}`).prepend(newComment);
					//Clear the form after submission.
					$(self).trigger("reset");
					pSelf.deleteComment($(" .delete-comment-button", newComment));
					//CHANGE :: enable the functionality of the toggle like button on the new comment
					new ToggleLike($(" .toggle-like-button", newComment));
					new Noty({
						theme: "relax",
						text: "Comment published!",
						type: "success",
						layout: "topRight",
						timeout: 3000,
					}).show();
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	}

	newCommentDom(comment, user) {
		// I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
		let commentUserAvatar, deleteButton, likeButton;
		let likes = [];

		try {
			if (comment.user.avatar) {
				commentUserAvatar = `<img
									class="user-avatar"
									src="${comment.user.avatar}"
									alt="${comment.user.name}"
									onclick="window.location.href='/users/profile/${comment.user._id}'"
									loading="lazy"
								/>`;
			} else {
				commentUserAvatar = `<img
									class="user-avatar"
									src="<%= assetPath('images/empty-avatar.png') %>"
									alt="${comment.user.name}"
									onclick="window.location.href='/users/profile/${comment.user._id}'"
									loading="lazy"
								/>`;
			}

			if (user.id == comment.user.id) {
				deleteButton = `<small>
								<a
									class="delete-comment-button"
									href="/comments/delete/${comment._id}"
								>
									<i class="fa-solid fa-trash"></i>
								</a>
							</small>`;
			} else {
				deleteButton = ``;
			}

			likes = comment.likes.filter(
				(like) =>
					like.user._id.toString() === locals.user._id.toString() &&
					like.onModel === "Comment" &&
					comment._id.toString() === like.likeable._id.toString()
			);

			if (likes.length > 0) {
				likeButton = `<a
				href="/likes/toggle/?id=${comment._id}&type=Comment"
				class="like toggle-like-button comment-like-button"
				data-likes="0"
				style="color: rgb(255, 0, 0)"
			>
				<i class="fa-solid fa-thumbs-up"></i>
				&ensp;<span>0 Like</span>
			</a>`;
			} else {
				likeButton = `<a
				href="/likes/toggle/?id=${comment._id}&type=Comment"
				class="like toggle-like-button comment-like-button"
				data-likes="0"
				style="color: #b8fff9"
			>
				<i class="fa-solid fa-thumbs-up"></i>
				&ensp;<span>0 Like</span>
			</a>`;
			}
		} catch (e) {
			console.log(e);
		}
		//CHANGE :: Show the count of 0 likes on this new comment.

		return $(`<li id="comment-${comment._id}" class="post-comments-li">
	<div class="comment">
		<div class="comment-heading">
			${commentUserAvatar}
			<p class="comment-info">
				<small
					onclick="window.location.href='/users/profile/${comment.user._id}'"
					>${comment.user.name}</small
				>
				<small>${this.printPostDate(comment.updatedAt)}</small>
			</p>
			${deleteButton}
		</div>
		<div class="comment-content">
			<p>${comment.content}</p>
		</div>
		<div class="comment-react">
			${likeButton}
		</div>
	</div>
</li>
`);
	}

	//Method to set the date on which the post was created in the correct format.
	printPostDate(dat) {
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

	deleteComment(deleteLink) {
		$(deleteLink).click(function (e) {
			e.preventDefault();

			$.ajax({
				type: "get",
				url: $(deleteLink).prop("href"),
				success: function (data) {
					$(`#comment-${data.data.comment_id}`).remove();

					new Noty({
						theme: "relax",
						text: "Comment Deleted",
						type: "success",
						layout: "topRight",
						timeout: 3000,
					}).show();
				},
				error: function (error) {
					console.log(error.responseText);
				},
			});
		});
	}
}
