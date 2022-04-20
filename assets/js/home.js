{
	try {
		function sidebar() {
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
}
