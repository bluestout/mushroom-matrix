let speciesFlkty; 

function initSpeciesSlider() {
	const slider = document.querySelector(
		".species-spotlight .species-spotlight__slider"
	);
	if (!slider) return null;

	if (slider.classList.contains("flickity-enabled")) {
		// If it's already initialized but potentially broken, destroy and reinitialize
		const existingFlickity = Flickity.data(slider);
		if (existingFlickity) existingFlickity.destroy();
	}

	try {
		const flkty = new Flickity(slider, {
			cellAlign: "left",
			contain: true,
			groupCells: 1,
			pageDots: false,
			prevNextButtons: true,
			draggable: true,
			wrapAround: false,
			percentPosition: true,
			freeScroll: false,
			rightToLeft: false,
			adaptiveHeight: true,
		});

		// Make sure to reposition cells after all images are loaded
		slider.querySelectorAll("img").forEach(img => {
			if (!img.complete) {
				img.onload = () => {
					flkty.resize();
				};
			}
		});

		// Store the reference globally
		speciesFlkty = flkty;

		return flkty;
	} catch (error) {
		console.error("Error initializing Flickity:", error);
		return null;
	}
}


// Initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
	// Try to initialize immediately
	const initialFlkty = initSpeciesSlider();

	// If initialization failed or slider wasn't ready, retry with a small delay
	if (!initialFlkty) {
		setTimeout(initSpeciesSlider, 100);
	}
});

// Also initialize on window.onload to ensure all resources are loaded
window.addEventListener("load", function () {
	// If the slider exists but isn't properly initialized, reinitialize it
	const slider = document.querySelector(
		".species-spotlight .species-spotlight__slider"
	);
	if (
		slider &&
		(!speciesFlkty || !slider.classList.contains("flickity-enabled"))
	) {
		initSpeciesSlider();
	}

	// Force a resize in case images changed the layout
	if (speciesFlkty) {
		setTimeout(() => {
			speciesFlkty.resize();
		}, 100);
	}
});
