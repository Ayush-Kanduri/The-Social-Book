class Friendship {
	constructor(element) {
		this.toggler = element;
		this.toggleFriendship(this.toggler);
	}
	toggleFriendship(toggler) {
		$(toggler).on("click", (e) => {
			e.stopPropagation();
			e.preventDefault();
			let self = this.toggler;
			//A new way of writing AJAX, it looks like Promises.
			$.ajax({
				type: "POST",
				url: $(self).attr("href"),
			})
				.done((data) => {
					if (data.data.unfriended) {
						$(self).parent().remove();
					}
					new Noty({
						text: "Friendship Ended !!",
						type: "success",
						theme: "relax",
						layout: "topRight",
						timeout: 2000,
					}).show();
					return;
				})
				.fail((err) => {
					console.log("Error in completing the request: ", err);
				});
		});
	}
}

{
	try {
		$(" #friendship_button").each(function () {
			let self = this;
			let friendship = new Friendship(self);
		});
	} catch (e) {
		console.log(e);
	}
}
