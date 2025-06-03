document.addEventListener("DOMContentLoaded", () => {
	// short delay to ensure elements are loaded
	setTimeout(() => {
		initSubscriptionMonitor();
	}, 1000);
});

function initSubscriptionMonitor() {
	const subscriptionContainer = document.querySelector(
		".rtx_option.rtx_option--sub"
	);
	const onetimeContainer = document.querySelector(
		".rtx_option.rtx_option--onetime"
	);
	const addToCartButton = document.querySelector(
		".product-form__buttons > button"
	);

	if (!subscriptionContainer || !onetimeContainer || !addToCartButton) {
		console.warn(
			"Subscription container, one-time purchase container, or Add to Cart button not found. Retrying in 1 second..."
		);
		setTimeout(initSubscriptionMonitor, 1000);
		return;
	}

	// console.log("Subscription monitor initialized successfully");

	// Initial check for which purchase option is selected
	checkPurchaseOptions(
		subscriptionContainer,
		onetimeContainer,
		addToCartButton
	);

	// mutation observers to watch for class changes on both containers
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === "class"
			) {
				checkPurchaseOptions(
					subscriptionContainer,
					onetimeContainer,
					addToCartButton
				);
			}
		});
	});

	// start the observers for both containers
	observer.observe(subscriptionContainer, {
		attributes: true,
		attributeFilter: ["class"],
	});

	observer.observe(onetimeContainer, {
		attributes: true,
		attributeFilter: ["class"],
	});

	// Also watch for clicks on both options as a fallback
	subscriptionContainer.addEventListener("click", () => {
		// Add a small delay to ensure class changes have been applied
		setTimeout(() => {
			checkPurchaseOptions(
				subscriptionContainer,
				onetimeContainer,
				addToCartButton
			);
		}, 100);
	});

	onetimeContainer.addEventListener("click", () => {
		// small delay to check if class changes have been applied
		setTimeout(() => {
			checkPurchaseOptions(
				subscriptionContainer,
				onetimeContainer,
				addToCartButton
			);
		}, 100);
	});
}

function checkPurchaseOptions(
	subscriptionContainer,
	onetimeContainer,
	addToCartButton
) {
	// Check which option is active
	const isSubscriptionActive =
		subscriptionContainer.classList.contains("option--active");
	const isOnetimeActive =
		onetimeContainer.classList.contains("option--active");

	if (isSubscriptionActive) {
		// Get the subscription details and price
		const subheadingElement = subscriptionContainer.querySelector(
			".rtx_option_subheading"
		);
		const subscriptionText = subheadingElement
			? subheadingElement.textContent.trim()
			: "";

		let subscriptionPrice = extractPriceFromText(subscriptionText);

		// console.log(
		// 	"Subscription selected:",
		// 	subscriptionText,
		// 	"Price:",
		// 	subscriptionPrice
		// );

		// Update the add to cart button
		updateAddToCartButton(
			addToCartButton,
			true,
			subscriptionText,
			subscriptionPrice
		);
	} else if (isOnetimeActive) {
		// Get the one-time purchase price
		let onetimePrice = "";
		const priceElement = onetimeContainer.querySelector("[data-price]");

		if (priceElement) {
			onetimePrice =
				priceElement.getAttribute("data-price") ||
				priceElement.textContent.trim();
		} else {
			// If there's no dedicated price element, try to find any price-looking text
			const onetimeText = onetimeContainer.textContent.trim();
			onetimePrice = extractPriceFromText(onetimeText);
		}

		console.log("One-time purchase selected, Price:", onetimePrice);

		// Update the add to cart button
		updateAddToCartButton(addToCartButton, false, "", onetimePrice);
	} else {
		console.log("No purchase option actively selected");
	}
}

// Helper function to extract price from text
function extractPriceFromText(text) {
	if (!text) return "";

	// Look for a price pattern ($XX.XX or $XX)
	const priceMatch = text.match(/\$\d+(\.\d{2})?/);
	return priceMatch ? priceMatch[0] : "";
}

function updateAddToCartButton(
	button,
	isSubscription,
	subscriptionText,
	price
) {
	// Set subscription data attributes
	button.dataset.subscriptionSelected = isSubscription ? "true" : "false";
	button.dataset.subscriptionDetails = subscriptionText || "";

	// Update the price in the button
	const priceElement = button.querySelector(
		".product-form__submit--current-price"
	);

	if (priceElement && price) {
		// Store the original price if this is the first time we're updating it
		if (!button.dataset.originalPrice) {
			button.dataset.originalPrice = priceElement.textContent;
		}

		// Update the price text
		priceElement.textContent = price;
	} else if (priceElement && !price && button.dataset.originalPrice) {
		// Reset to original price if no new price
		priceElement.textContent = button.dataset.originalPrice;
	}

	// custom event that other parts of your code can listen for
	const event = new CustomEvent("subscriptionStatusChanged", {
		detail: {
			isSubscription,
			subscriptionText,
			price,
		},
	});
	document.dispatchEvent(event);
}
