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
		const fileInput = () => {
			const image = document.querySelector("input.image");
			const video = document.querySelector("input.video");
			const form = document.getElementById("new-post-form");

			form.addEventListener("reset", (e) => {
				if (!!document.querySelector(".preview-image")) {
					document.querySelector(".preview-image").remove();
				}
				if (!!document.querySelector(".preview-video")) {
					document.querySelector(".preview-video").remove();
				}
			});

			image.addEventListener("change", (e) => {
				if (!!document.querySelector(".preview-image")) {
					document.querySelector(".preview-image").remove();
				}

				const file = e.target.files[0];

				if (
					file !== undefined ||
					file !== "undefined" ||
					file !== null ||
					file !== "null" ||
					file !== ""
				) {
					if (
						file.type.match("image.png") ||
						file.type.match("image.jpeg") ||
						file.type.match("image.gif") ||
						file.type.match("image.jpg")
					) {
						//file size should be less than equal to 5MB
						if (file.size <= 1024 * 1024 * 5) {
							const reader = new FileReader();
							reader.readAsDataURL(file);
							reader.onload = (e) => {
								const preview = document.querySelector(".preview-box");
								const imgPreview = document.createElement("div");
								imgPreview.classList.add("preview-image");
								const img = createImageThumbnail();
								img.src = e.target.result;
								img.addEventListener("click", (e) => {
									image.value = "";
									e.target.parentElement.remove();
								});
								imgPreview.appendChild(img);
								preview.appendChild(imgPreview);
							};
						} else {
							new Noty({
								theme: "metroui",
								text: "Image File Size Limit is 5MB",
								type: "error",
								layout: "topRight",
								timeout: 3000,
							}).show();
							image.value = "";
							return;
						}
					} else {
						new Noty({
							theme: "metroui",
							text: "Only Images (.png .jpg .jpeg .gif) are allowed",
							type: "error",
							layout: "topRight",
							timeout: 3000,
						}).show();
						image.value = "";
						return;
					}
				}
			});

			video.addEventListener("change", (e) => {
				if (!!document.querySelector(".preview-video")) {
					document.querySelector(".preview-video").remove();
				}

				const file = e.target.files[0];

				if (
					file !== undefined ||
					file !== "undefined" ||
					file !== null ||
					file !== "null" ||
					file !== ""
				) {
					if (
						file.type.match("video.mp4") ||
						file.type.match("video.ogg") ||
						file.type.match("video.webm") ||
						file.type.match("video.mkv")
					) {
						//file size should be less than equal to 15MB
						if (file.size <= 1024 * 1024 * 15) {
							const reader = new FileReader();
							reader.readAsDataURL(file);
							reader.onload = (e) => {
								const preview = document.querySelector(".preview-box");
								const vidPreview = document.createElement("div");
								vidPreview.classList.add("preview-video");
								const vid = createVideoThumbnail();
								vid.src = e.target.result;
								vid.addEventListener("click", (e) => {
									video.value = "";
									e.target.parentElement.remove();
								});
								vidPreview.appendChild(vid);
								preview.appendChild(vidPreview);
							};
						} else {
							new Noty({
								theme: "metroui",
								text: "Video File Size Limit is 15MB",
								type: "error",
								layout: "topRight",
								timeout: 3000,
							}).show();
							video.value = "";
							return;
						}
					} else {
						new Noty({
							theme: "metroui",
							text: "Only Videos (.mp4 .ogg .webm .mkv) are allowed",
							type: "error",
							layout: "topRight",
							timeout: 3000,
						}).show();
						video.value = "";
						return;
					}
				}
			});
		};
		const createImageThumbnail = () => {
			const img = document.createElement("img");
			img.classList.add("preview");
			img.setAttribute("id", "post-image-preview");
			img.setAttribute("alt", img.id);
			img.setAttribute("src", "");
			return img;
		};
		const createVideoThumbnail = () => {
			const video = document.createElement("video");
			video.classList.add("preview");
			video.setAttribute("muted", "true");
			video.setAttribute("id", "post-video-preview");
			video.setAttribute("src", "");
			return video;
		};
		fileInput();
	} catch (e) {
		// console.log(e);
	}
}
