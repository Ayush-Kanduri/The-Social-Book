class ToggleFriendship {
	constructor(element) {
		this.toggler = element;
		this.toggleFriendship(this.toggler);
	}
	toggleFriendship(toggler) {
		$(toggler).on("click", (e) => {
			e.preventDefault();
			let self = this.toggler;
			//A new way of writing AJAX, it looks like Promises.
			$.ajax({
				type: "POST",
				url: $(self).attr("href"),
			})
				.done((data) => {
					let html;
					if (data.data.unfriended) {
						html = `Add Friend`;
					} else {
						html = `Remove Friend`;
					}
					new Noty({
						text: data.message,
						type: "success",
						theme: "relax",
						layout: "topRight",
						timeout: 2000,
					}).show();
					$(self).html(html);
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
			let toggleFriendship = new ToggleFriendship(self);
		});
	} catch (e) {
		console.log(e);
	}
}
