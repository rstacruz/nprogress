/**
 * (Internal) converts a percentage (`0..1`) to a bar translateX
 * percentage (`-100%..0%`).
 * @param {Number} n
 */

export function toBarPerc(n) {
  return (-1 + n) * 100;
}

/**
 * (Internal) returns the correct CSS for changing the bar's
 * position given an n percentage, and speed and ease from Settings
 *
 * @param {'translate3d' | 'translate' | 'margin-left'} property
 * @param {number} n
 * @param {number} speed
 * @param {string} ease
 */

export function barPositionCSS(property, n, speed, ease) {
  /** @type CSSDefinition */
  var barCSS;

  if (property === "translate3d") {
    barCSS = { transform: `translate3d(${toBarPerc(n)}%,0,0)` };
  } else if (property === "translate") {
    barCSS = { transform: `translate({toBarPerc(n)}%,0)` };
  } else {
    barCSS = { "margin-left": `${toBarPerc(n)}%` };
  }

  barCSS.transition = `all ${speed}ms ${ease}`;

  return barCSS;
}

/**
 * Helper for clamping to min and max values
 * @param {number} n
 * @param {number} min
 * @param {number} max
 */

export function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * Determine which positioning CSS rule to use.
 * @return {'translate3d' | 'translate' | 'margin'}
 */

export function getPositioningCSS() {
  // Sniff on document.body.style
  var bodyStyle = document.body.style;

  // Sniff prefixes
  var vendorPrefix =
    "WebkitTransform" in bodyStyle
      ? "Webkit"
      : "MozTransform" in bodyStyle
      ? "Moz"
      : "msTransform" in bodyStyle
      ? "ms"
      : "OTransform" in bodyStyle
      ? "O"
      : "";

  if (`${vendorPrefix}Perspective` in bodyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
    return "translate3d";
  } else if (`${vendorPrefix}Transform` in bodyStyle) {
    // Browsers without 3D support, e.g. IE9
    return "translate";
  } else {
    // Browsers without translate() support, e.g. IE7-8
    return "margin";
  }
}
