/**
 * Rounded Bar Chart Add-on — Main Component
 *
 * Extension point : sap.addOn.viz.plotarea.general
 *
 * Behaviour:
 *   - Receives bar geometry via setExtensionData()
 *   - Re-renders each bar as a positioned <div> with
 *     border-top-right-radius + border-bottom-right-radius applied
 *   - Native axis labels and data labels are kept untouched (no re-rendering)
 *   - Corner radius is fixed at 12 px (no settings panel required)
 *
 * Note: Shadow DOM is intentionally NOT used — SAC does not support it
 *       in the Widget Add-On context.
 */

(function () {
  'use strict';

  const CORNER_RADIUS = 12; // px — right-end rounding
  const TAG = 'com-custom-rounded-bar-addon';

  class RoundedBarAddon extends HTMLElement {

    connectedCallback() {
      // Apply host positioning so the layer sits exactly over the plot area
      this.style.cssText = [
        'display:block',
        'position:absolute',
        'top:0', 'left:0',
        'width:100%', 'height:100%',
        'pointer-events:none',
        'overflow:hidden'
      ].join(';');

      if (!this._layer) {
        this._layer = document.createElement('div');
        this._layer.style.cssText = [
          'position:absolute',
          'top:0', 'left:0',
          'width:100%', 'height:100%'
        ].join(';');
        this.appendChild(this._layer);
      }
    }

    /* Called by SAC with the current chart geometry ─────────────────────── */
    setExtensionData(data) {
      // Ensure the layer exists even if connectedCallback hasn't fired yet
      if (!this._layer) {
        this._layer = document.createElement('div');
        this._layer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%';
        this.appendChild(this._layer);
      }

      this._layer.innerHTML = '';

      if (!data) return;

      // SAC passes bar data inside data.measures (array of series).
      // Each series has a dataPoints array with per-bar geometry:
      //   { x, y, width, height, color }
      const measures = data.measures || [];

      measures.forEach(function (measure) {
        var points = measure.dataPoints || [];

        points.forEach(function (point) {
          if (!point || point.width <= 0 || point.height <= 0) return;

          var bar = document.createElement('div');
          bar.style.cssText = [
            'position:absolute',
            'box-sizing:border-box',
            'left:'   + point.x      + 'px',
            'top:'    + point.y      + 'px',
            'width:'  + point.width  + 'px',
            'height:' + point.height + 'px',
            'background-color:' + (point.color || measure.color || '#5899DA'),
            'border-top-right-radius:'    + CORNER_RADIUS + 'px',
            'border-bottom-right-radius:' + CORNER_RADIUS + 'px'
          ].join(';');

          this._layer.appendChild(bar);
        }, this);
      }, this);
    }

    /* SAC lifecycle hooks ─────────────────────────────────────────────────── */
    onCustomWidgetBeforeUpdate() {}
    onCustomWidgetAfterUpdate()  {}
    onCustomWidgetDestroy() {
      if (this._layer) { this._layer.innerHTML = ''; }
    }
  }

  // Guard against duplicate registration (e.g. hot-reload scenarios)
  if (!customElements.get(TAG)) {
    customElements.define(TAG, RoundedBarAddon);
  }

}());
