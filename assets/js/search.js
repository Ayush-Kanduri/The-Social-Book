{
	try {
		const searchUsers = async (event) => {
			let value = event.target.value;
			let filteredUsers = [];
			let ul = document.getElementsByClassName("autocomplete-box")[0];
			let li = ul.querySelectorAll("li");

			if (value === "") {
				li.forEach((li) => {
					li.remove();
				});

				filteredUsers = [];
				value = "";
				ul.style.display = "none";

				document.onclick = (e) => {
					li.forEach((li) => {
						li.remove();
					});
					filteredUsers = [];
					value = "";
					ul.style.display = "none";
				};

				return;
			}

			try {
				// const url = "http://thesocialbook.co.in/api/v1/users";
				const url = "http://localhost:8000/api/v1/users";
				const response = await fetch(url);
				const data = await response.json();

				const users = data.data.users;
				filteredUsers = users.filter((user) => {
					return user.name.toLowerCase().includes(value.toLowerCase());
				});

				if (filteredUsers.length === 0) {
					li.forEach((li) => {
						li.remove();
					});

					ul.style.display = "none";

					filteredUsers = [];

					document.onclick = (e) => {
						li.forEach((li) => {
							li.remove();
						});
						filteredUsers = [];
						ul.style.display = "none";
					};
					return;
				} else {
					document.onclick = (event) => {
						const Class = event.target.className;
						const id = event.target.id;
						const str1 = "autocomplete-box";
						const str2 = "search-users-input";
						if (Class === str1 || id === str2) {
							ul.style.display = "initial";
							return;
						} else {
							ul.style.display = "none";
							return;
						}
					};

					ul.style.display = "initial";

					li.forEach((li) => {
						li.remove();
					});

					filteredUsers.forEach((user) => {
						const element = createLiElement(user);
						ul.appendChild(element);
					});
					return;
				}
			} catch (err) {
				// console.log(err);
			}
		};

		const createLiElement = (user) => {
			const li = document.createElement("li");
			const a = document.createElement("a");
			const img = document.createElement("img");
			const span = document.createElement("span");

			if (user.avatar) {
				img.src = user.avatar;
			} else {
				img.src = "<%= assetPath('images/empty-avatar.png') %>";
			}

			img.setAttribute("alt", user.name);
			span.textContent = user.name;
			a.href = `/users/profile/${user._id}`;

			a.appendChild(img);
			a.appendChild(span);

			li.appendChild(a);
			return li;
		};

		const search = document.getElementById("search-users-input");
		search.addEventListener("input", searchUsers);
	} catch (err) {
		// console.log(err);
	}
}
