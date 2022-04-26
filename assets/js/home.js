{
	try {
		function jsMediaQuery(width) {
			if (width.matches) {
				document.querySelector(".sidebar").style.display = "none";
				document.querySelector("#open").style.display = "none";
			} else {
				// document.querySelector(".sidebar").style.display = "initial";
				document.querySelector("#open").style.display = "initial";
			}
		}

		function sidebar() {
			const width = window.matchMedia("(min-width: 700px)");
			jsMediaQuery(width);
			width.addEventListener("change", jsMediaQuery);

			const open = document.querySelector("#open");
			const close = document.querySelector(".sidebar .logo > #close");
			open.addEventListener("click", () => {
				document.querySelector(".sidebar").style.display = "initial";
				document.querySelector(".sidebar").classList.remove("slide-right");
				document.querySelector(".sidebar").classList.add("slide-left");
			});
			close.addEventListener("click", () => {
				document.querySelector(".sidebar").classList.add("slide-right");
				setTimeout(() => {
					document
						.querySelector(".sidebar")
						.classList.remove("slide-left");
					document.querySelector(".sidebar").style.display = "none";
				}, 1000);
			});
		}
		sidebar();
	} catch (e) {
		// console.log(e);
	}

	try {
		function textAnimation() {
			let i = 0;
			const wordElement = document.querySelector("#text-animation-header");
			const words = ["Create.", "Share.", "Connect.", "THE SOCIAL BOOK"];
			const speed = 300;

			wordElement.textContent = "";

			function sleep(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			}

			const animate = (index) => {
				const word = words[index];
				const wordLength = word.length;

				if (i < wordLength) {
					wordElement.textContent += word.charAt(i);
					i++;
					setTimeout(() => {
						animate(index);
					}, speed);
				} else {
					const lastWord = words[words.length - 1];
					if (word !== lastWord) {
						if (word !== words[words.length - 2]) {
							setTimeout(() => {
								i = 0;
								wordElement.textContent = "";
								animate(words.indexOf(word) + 1);
							}, speed);
						} else {
							wordElement.textContent = "";
							wordElement.classList.remove("blink");
							wordElement.style.border = "none";
							wordElement.textContent = lastWord;
							wordElement.style.transform = "scale(1.5)";
							wordElement.classList.add("fade");
							sleep(2000).then(() => {
								setTimeout(() => {
									i = 0;
									wordElement.textContent = "";
									wordElement.classList.remove("fade");
									wordElement.classList.add("blink");
									wordElement.style.borderRight =
										"0.15em solid var(--logo-color)";
									wordElement.style.transform = "scale(1)";
									animate(i);
								}, speed);
							});
						}
					} else {
						setTimeout(() => {
							i = 1;
							wordElement.textContent = "";
							animate(i);
						}, speed);
					}
				}
			};
			animate(0);
		}
		textAnimation();
	} catch (e) {
		// console.log(e);
	}

	try {
		function printPostDate() {
			const dateEle = document.querySelectorAll(".post-info");

			dateEle.forEach((item) => {
				let date = JSON.stringify(item.children[1].textContent);
				date = new Date(date);
				const day = date.getDate();
				const month = date.getMonth();
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
				item.children[1].textContent = format;
			});
		}
		printPostDate();
	} catch (e) {
		// console.log(e);
	}

	try {
		function printCommentDate() {
			const dateEle = document.querySelectorAll(".comment-info");

			dateEle.forEach((item) => {
				let date = JSON.stringify(item.children[1].textContent);
				date = new Date(date);
				const day = date.getDate();
				const month = date.getMonth();
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
				item.children[1].textContent = format;
			});
		}
		printCommentDate();
	} catch (e) {
		// console.log(e);
	}

	try {
		const remove = (e) => {
			e.target.parentElement.remove();
		};
		function postPreview() {
			const imagePreview = document.querySelector("img.preview");
			const videoPreview = document.querySelector("video.preview");
			console.log(imagePreview);
			console.log(videoPreview);
			imagePreview.addEventListener("click", remove);
			videoPreview.addEventListener("click", remove);
		}
		postPreview();
	} catch (e) {
		// console.log(e);
	}
}
