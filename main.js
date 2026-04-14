var _tag = 'com-custom-rounded-bar-addon';

class RoundedBarAddon extends HTMLElement {
  setExtensionData(data) {
    this.innerHTML = '';
    if (!data || !data.series) return;
    data.series.forEach(function(s) {
      (s.dataPoints || []).forEach(function(p) {
        if (!p || p.width <= 0 || p.height <= 0) return;
        var d = document.createElement('div');
        d.style.cssText = 'position:absolute;box-sizing:border-box'
          + ';left:'   + p.x      + 'px'
          + ';top:'    + p.y      + 'px'
          + ';width:'  + p.width  + 'px'
          + ';height:' + p.height + 'px'
          + ';background-color:' + (p.color || s.color || '#5899DA')
          + ';border-top-right-radius:12px'
          + ';border-bottom-right-radius:12px';
        this.appendChild(d);
      }, this);
    }, this);
  }
}

if (!customElements.get(_tag)) {
  customElements.define(_tag, RoundedBarAddon);
}
