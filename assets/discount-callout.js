if (!customElements.get('discount-callout')) {
  customElements.define(
    'discount-callout',
    class DiscountCallout extends HTMLElement {
      constructor() {
        super();
        this.calloutElement = this.querySelector('.buy-button-discount-callout');
        this.iconElement = this.querySelector('.icon-tag');
        this.useMetafields = this.dataset.useMetafields === 'true';
      }

      connectedCallback() {
        // Subscribe to variant change events
        this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          const { html, sectionId } = event.data;

          // Only update if this is the correct section
          if (sectionId === this.dataset.section) {
            this.updateDiscountCallout(html);
          }
        });
      }

      disconnectedCallback() {
        if (this.variantChangeUnsubscriber) {
          this.variantChangeUnsubscriber();
        }
      }

      updateDiscountCallout(html) {
        // Find the discount callout in the new HTML
        const newDiscountCallout = html.querySelector('.buy-button-discount-callout');

        // If we're using metafields, only show variant-specific text (no fallback)
        if (this.useMetafields) {
          if (newDiscountCallout) {
            this.showCallout(newDiscountCallout);
          } else {
            // Hide if this variant doesn't have a metafield value
            this.hideCallout();
          }
        } else {
          // If not using metafields, the fallback text should always show (if it exists)
          // In this case, the newDiscountCallout will always exist if there's a fallback
          if (newDiscountCallout) {
            this.showCallout(newDiscountCallout);
          } else {
            this.hideCallout();
          }
        }
      }

      showCallout(newDiscountCallout) {
        if (!this.calloutElement) {
          // Create the callout element if it doesn't exist
          this.calloutElement = document.createElement('div');
          this.calloutElement.className = 'buy-button-discount-callout';

          // Create icon element
          const iconSpan = document.createElement('span');
          iconSpan.className = 'icon-tag';
          iconSpan.innerHTML = this.iconElement ? this.iconElement.innerHTML : '';

          this.calloutElement.appendChild(iconSpan);
          this.appendChild(this.calloutElement);
        }

        // Update the text content (skip the icon)
        const newTextContent = Array.from(newDiscountCallout.childNodes)
          .filter(node => !node.classList || !node.classList.contains('icon-tag'))
          .map(node => node.textContent)
          .join('');

        // Remove old text nodes and add new one
        Array.from(this.calloutElement.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE || (!node.classList || !node.classList.contains('icon-tag'))) {
            if (node.nodeType !== Node.TEXT_NODE || node !== this.iconElement) {
              node.remove();
            }
          }
        });

        this.calloutElement.appendChild(document.createTextNode(newTextContent));
        this.calloutElement.style.display = '';
      }

      hideCallout() {
        if (this.calloutElement) {
          this.calloutElement.style.display = 'none';
        }
      }
    }
  );
}
