const cssPrefixes = ["Webkit", "O", "Moz", "ms"];

/**
 * (Internal) Applies css properties to an element, similar to the jQuery
 * css method.
 *
 * While this helper does assist with vendor prefixed property names, it
 * does not perform any manipulation of values prior to setting styles.
 */

let setCSS = (function () {
  let cssProps = {};

  function getStyleProp(/** @type string */ name) {
    name = camelCase(name);
    return cssProps[name] || (cssProps[name] = getVendorProp(name));
  }

  function applyCss(
    /** @type HTMLElement */ element,
    /** @type string */ prop,
    /** @type string */ value
  ) {
    prop = getStyleProp(prop);
    element.style[prop] = value;
  }

  return function (
    /** @type HTMLElement */ element,
    /** @type any */ properties
  ) {
    let args = arguments,
      prop,
      value;

    if (args.length === 2) {
      for (prop in properties) {
        value = properties[prop];
        if (value !== undefined && properties.hasOwnProperty(prop))
          applyCss(element, prop, value);
      }
    } else {
      applyCss(element, args[1], args[2]);
    }
  };
})();

/**
 * Returns the vendor-prefixed version of a style property name.
 *
 * @param {string} name
 * @return string
 *
 * @example
 *     getVendorProp('flex') => 'WebkitFlex'
 */

function getVendorProp(name) {
  let style = document.body.style;
  if (name in style) return name;

  let i = cssPrefixes.length,
    capName = name.charAt(0).toUpperCase() + name.slice(1),
    vendorName;
  while (i--) {
    vendorName = cssPrefixes[i] + capName;
    if (vendorName in style) return vendorName;
  }

  return name;
}

/**
 * @param {string} string
 */

function camelCase(string) {
  return string
    .replace(/^-ms-/, "ms-")
    .replace(/-([\da-z])/gi, function (match, letter) {
      return letter.toUpperCase();
    });
}

export default setCSS;
