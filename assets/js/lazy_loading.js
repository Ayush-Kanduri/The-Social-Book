{
	try {
		const lazyLoading = () => {
			const images = document.querySelectorAll("img[data-src]");

			const options = {
				root: null,
				rootMargin: "100px",
				threshold: 0,
			};

			const observer = new IntersectionObserver((entries, observer) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const img = entry.target;
					img.src = img.dataset.src;
					observer.unobserve(img);
				});
			}, options);

			images.forEach((image) => {
				observer.observe(image);
			});
		};
		lazyLoading();
	} catch (e) {
		// console.log(e);
	}
}
