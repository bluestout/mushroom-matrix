if (!customElements.get('anchor-element')) {
  customElements.define(
    'anchor-element',
    class AnchorElement extends HTMLElement {
      constructor() {
        super();
        this.links = document.querySelectorAll(`[href*="#${this.id}"]`);

        this.links.forEach((link) => {
          link
            .addEventListener('click', this.scrollTo.bind(this));
        });
      }

      scrollTo(event) {
        event.preventDefault();
        let elementTop = this.offsetTop;
        window.scrollTo({top: elementTop, behavior: 'smooth'});
      }
    }
  );
}
