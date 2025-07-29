document.addEventListener('DOMContentLoaded', function () {
  function updateSlideFocus() {
    document.querySelectorAll('.slideshow__slide').forEach(function (slide) {
      var isHidden = slide.getAttribute('aria-hidden') === 'true';
      var focusables = slide.querySelectorAll('a, button, input, textarea, select, [tabindex]');
      focusables.forEach(function (el) {
        if (isHidden) {
          el.setAttribute('tabindex', '-1');
          el.setAttribute('aria-disabled', 'true');
        } else {
          if (el.hasAttribute('tabindex')) el.removeAttribute('tabindex');
          if (el.hasAttribute('aria-disabled')) el.removeAttribute('aria-disabled');
        }
      });
    });
  }

  // Initial run
  updateSlideFocus();

  // Observe changes to aria-hidden on slides
  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'aria-hidden') {
        updateSlideFocus();
      }
    });
  });

  document.querySelectorAll('.slideshow__slide').forEach(function (slide) {
    observer.observe(slide, { attributes: true });
  });

  // Optionally, listen for custom events if your slider triggers them
  document.addEventListener('slideshow:slideChange', updateSlideFocus);
});
