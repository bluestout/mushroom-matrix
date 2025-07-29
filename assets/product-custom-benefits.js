document.addEventListener('DOMContentLoaded', function () {
  // Currently cat variant is always the first one
  const sectionContainer = document.querySelector('.pdp-custom-benefits-section[data-first-variant-id]');

  if (!sectionContainer) {
    return; // Exit if section not found
  }

  const firstVariantId = sectionContainer.dataset.firstVariantId;
  let setupComplete = false;

  function setupVariantToggle() {
    const variantInput = document.querySelector('input[name="id"]');

    if (variantInput && !setupComplete) {
      setupComplete = true;

      function toggleContent() {
        const defaultContents = document.querySelectorAll('.default-content.is-description');
        const variantContents = document.querySelectorAll('.variant-content');

        if (variantInput.value === firstVariantId) {
          // Check if variant content exists and has content
          const hasVariantContent =
            variantContents.length > 0 && Array.from(variantContents).some((el) => el.textContent.trim() !== '');

          if (hasVariantContent) {
            // Show variant content, hide default
            defaultContents.forEach((el) => el.classList.remove('show'));
            variantContents.forEach((el) => el.classList.add('show'));
          } else {
            // No variant content available, show default
            defaultContents.forEach((el) => el.classList.add('show'));
            variantContents.forEach((el) => el.classList.remove('show'));
          }
        } else {
          // Show default content, hide variant
          defaultContents.forEach((el) => el.classList.add('show'));
          variantContents.forEach((el) => el.classList.remove('show'));
        }
      }

      variantInput.addEventListener('change', toggleContent);

      // Check initial state on page load
      toggleContent();
    } else if (!setupComplete) {
      // Retry if product-info is not loaded yet
      setTimeout(setupVariantToggle, 100);
    }
  }

  setupVariantToggle();
});
