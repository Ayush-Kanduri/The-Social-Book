//CHANGE :: create a class to toggle likes when a link is clicked, using AJAX.

class ToggleLike {
	constructor(toggleElement) {
		this.toggler = toggleElement;
		this.toggleLike(this.toggler);
	}

	toggleLike(toggler) {
		$(toggler).on("click", (e) => {
			e.preventDefault();
			let self = this.toggler;
			//A new way of writing AJAX, it looks like Promises.
			$.ajax({
				type: "POST",
				url: $(self).attr("href"),
			})
				.done((data) => {
					let likesCount = parseInt($(self).attr("data-likes"));
					if (data.data.deleted) {
						likesCount--;
					} else {
						likesCount++;
					}
					$(self).attr("data-likes", likesCount);
					// let i = $(self).children("i");
					$(self).html(`<i class='fa-solid fa-thumbs-up'></i>&ensp;
                <span>${likesCount} Like</span>`);
					return;
				})
				.fail((err) => {
					console.log("Error in completing the request: ", err);
				});
		});
	}
	setColor(toggler, color) {
		$(toggler).css("color", color);
	}
}

{
	try {
		$(" .toggle-like-button").each(function () {
			let self = this;
			let toggleLike = new ToggleLike(self);
		});
	} catch (e) {
		console.log(e);
	}
}
