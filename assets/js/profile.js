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
}
