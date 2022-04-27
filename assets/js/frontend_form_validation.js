{
	try {
		function validation() {
			const name = document.getElementsByName("name")[0];
			const password = document.getElementsByName("password")[0];
			const form = document.getElementsByTagName("form")[0];
			form.addEventListener("submit", (e) => {
				if (name.value === "" || name.value == null) {
					e.preventDefault();
					new Noty({
						theme: "metroui",
						text: "Name is Required !!!",
						type: "error",
						layout: "topRight",
						timeout: 3000,
					}).show();
					return;
				}
				if (email.value === "" || email.value == null) {
					e.preventDefault();
					new Noty({
						theme: "metroui",
						text: "Email is Required !!!",
						type: "error",
						layout: "topRight",
						timeout: 3000,
					}).show();
					return;
				}
				if (password.value.length < 6) {
					e.preventDefault();
					new Noty({
						theme: "metroui",
						text: "Password should have minimum 6 Characters !!!",
						type: "error",
						layout: "topRight",
						timeout: 3000,
					}).show();
					return;
				}
			});
		}
		validation();
	} catch (e) {
		// console.log(e);
	}
}
