class RoundedBarAddon extends HTMLElement {
  connectedCallback() { document.body.style.background = 'red'; }
}
customElements.define('com-custom-rounded-bar-addon', RoundedBarAddon);
