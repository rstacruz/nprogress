import { removeElement, addClass, removeClass } from "./dom";

const NProgress = {};

/**
 * Last number.
 * @type {null | number}
 */

NProgress.status = null;

/**
 * @typedef CSSDefinition
 * @property {string=} margin-left
 * @property {string=} transition
 * @property {string=} transform
 */

let Settings = {
  minimum: 0.08,
  easing: "linear",
  positionUsing: "",
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: true,
  barSelector: '[role="bar"]',
  spinnerSelector: '[role="spinner"]',
  parent: "body",
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
};

/**
 * Updates configuration.
 *
 *     NProgress.configure({
 *       minimum: 0.1
 *     });
 *
 * @param {Partial<typeof Settings>} options
 */

function configure(options) {
  /** @type {keyof typeof Settings} */
  var key;
  var value;

  for (key in options) {
    value = options[key];
    if (value !== undefined && options.hasOwnProperty(key))
      Settings[key] = value;
  }

  return this;
}

/**
 * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
 * @param {number} n
 * @example
 *     NProgress.set(0.4);
 *     NProgress.set(1.0);
 */

function set(n) {
  var started = isStarted();

  n = clamp(n, Settings.minimum, 1);
  NProgress.status = n === 1 ? null : n;

  var progress = NProgress.render(!started),
    bar = progress.querySelector(Settings.barSelector),
    speed = Settings.speed,
    ease = Settings.easing;

  progress.offsetWidth; /* Repaint */

  queue(function (next) {
    // Set positionUsing if it hasn't already been set
    if (Settings.positionUsing === "")
      Settings.positionUsing = NProgress.getPositioningCSS();

    // Add transition
    css(bar, barPositionCSS(n, speed, ease));

    if (n === 1) {
      // Fade out
      css(progress, {
        transition: "none",
        opacity: 1,
      });
      progress.offsetWidth; /* Repaint */

      setTimeout(function () {
        css(progress, {
          transition: "all " + speed + "ms linear",
          opacity: 0,
        });
        setTimeout(function () {
          NProgress.remove();
          next();
        }, speed);
      }, speed);
    } else {
      setTimeout(next, speed);
    }
  });

  return this;
}

function isStarted() {
  return typeof NProgress.status === "number";
}

/**
 * Shows the progress bar.
 * This is the same as setting the status to 0%, except that it doesn't go backwards.
 *
 * @example
 *     NProgress.start();
 */

NProgress.start = function () {
  if (!NProgress.status) set(0);

  var work = function () {
    setTimeout(function () {
      if (!NProgress.status) return;
      inc();
      work();
    }, Settings.trickleSpeed);
  };

  if (Settings.trickle) work();

  return this;
};

/**
 * Hides the progress bar.
 * This is the *sort of* the same as setting the status to 100%, with the
 * difference being `done()` makes some placebo effect of some realistic motion.
 *
 *     NProgress.done();
 *
 * If `true` is passed, it will show the progress bar even if its hidden.
 *
 *     NProgress.done(true);
 *
 * @param {boolean | null | void} force
 */

NProgress.done = function (force) {
  if (!force && !NProgress.status) return this;

  inc(0.3 + 0.5 * Math.random());
  set(1);
  return NProgress;
};

/**
 * Increments by a random amount.
 *
 * @param {number} amount
 * @return {NProgress}
 */

function inc(amount) {
  var n = NProgress.status;

  if (!n) {
    return NProgress.start();
  } else if (n > 1) {
    return;
  } else {
    if (typeof amount !== "number") {
      if (n >= 0 && n < 0.2) {
        amount = 0.1;
      } else if (n >= 0.2 && n < 0.5) {
        amount = 0.04;
      } else if (n >= 0.5 && n < 0.8) {
        amount = 0.02;
      } else if (n >= 0.8 && n < 0.99) {
        amount = 0.005;
      } else {
        amount = 0;
      }
    }

    n = clamp(n + amount, 0, 0.994);
    return set(n);
  }
}

/*
 * Alias for inc().
 */

function trickle() {
  return inc();
}

/**
 * (Internal) renders the progress bar markup based on the `template`
 * setting.
 */

NProgress.render = function (fromStart) {
  if (NProgress.isRendered()) return document.getElementById("nprogress");

  addClass(document.documentElement, "nprogress-busy");

  var progress = document.createElement("div");
  progress.id = "nprogress";
  progress.innerHTML = Settings.template;

  /** @type HTMLElement | null */
  let bar = progress.querySelector(Settings.barSelector);
  if (!bar)
    throw new Error(`NProgress: No bar found for '${Settings.barSelector}'`);

  let perc = fromStart ? "-100" : toBarPerc(NProgress.status || 0);

  /** @type HTMLElement | null */
  let parent = document.querySelector(Settings.parent);
  if (!parent)
    throw new Error(`NProgress: Invalid parent '${Settings.parent}'`);

  /** @type HTMLElement | null */
  let spinner;

  css(bar, {
    transition: "all 0 linear",
    transform: "translate3d(" + perc + "%,0,0)",
  });

  if (!Settings.showSpinner) {
    spinner = progress.querySelector(Settings.spinnerSelector);
    spinner && removeElement(spinner);
  }

  if (parent != document.body) {
    addClass(parent, "nprogress-custom-parent");
  }

  parent.appendChild(progress);
  return progress;
};

/**
 * Removes the element. Opposite of render().
 */

NProgress.remove = function () {
  removeClass(document.documentElement, "nprogress-busy");
  removeClass(
    document.querySelector(Settings.parent),
    "nprogress-custom-parent"
  );
  var progress = document.getElementById("nprogress");
  progress && removeElement(progress);
};

/**
 * Checks if the progress bar is rendered.
 */

NProgress.isRendered = function () {
  return !!document.getElementById("nprogress");
};

/**
 * Determine which positioning CSS rule to use.
 */

NProgress.getPositioningCSS = function () {
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

  if (vendorPrefix + "Perspective" in bodyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
    return "translate3d";
  } else if (vendorPrefix + "Transform" in bodyStyle) {
    // Browsers without 3D support, e.g. IE9
    return "translate";
  } else {
    // Browsers without translate() support, e.g. IE7-8
    return "margin";
  }
};

/**
 * Helper for clamping to min and max values
 * @param {number} n
 * @param {number} min
 * @param {number} max
 */

function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * (Internal) converts a percentage (`0..1`) to a bar translateX
 * percentage (`-100%..0%`).
 * @param {Number} n
 */

function toBarPerc(n) {
  return (-1 + n) * 100;
}

/**
 * (Internal) returns the correct CSS for changing the bar's
 * position given an n percentage, and speed and ease from Settings
 *
 * @param {number} n
 * @param {number} speed
 * @param {string} ease
 */

function barPositionCSS(n, speed, ease) {
  /** @type CSSDefinition */
  var barCSS;

  if (Settings.positionUsing === "translate3d") {
    barCSS = { transform: "translate3d(" + toBarPerc(n) + "%,0,0)" };
  } else if (Settings.positionUsing === "translate") {
    barCSS = { transform: "translate(" + toBarPerc(n) + "%,0)" };
  } else {
    barCSS = { "margin-left": toBarPerc(n) + "%" };
  }

  barCSS.transition = `all ${speed}ms ${ease}`;

  return barCSS;
}

/**
 * (Internal) Queues a function to be executed.
 */

var queue = (function () {
  var pending = [];

  function next() {
    var fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }

  return function (fn) {
    pending.push(fn);
    if (pending.length == 1) next();
  };
})();

/**
 * (Internal) Applies css properties to an element, similar to the jQuery
 * css method.
 *
 * While this helper does assist with vendor prefixed property names, it
 * does not perform any manipulation of values prior to setting styles.
 */

var css = (function () {
  var cssPrefixes = ["Webkit", "O", "Moz", "ms"],
    cssProps = {};

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

  /**
   * @param {string} name
   * @return string
   */

  function getVendorProp(name) {
    var style = document.body.style;
    if (name in style) return name;

    var i = cssPrefixes.length,
      capName = name.charAt(0).toUpperCase() + name.slice(1),
      vendorName;
    while (i--) {
      vendorName = cssPrefixes[i] + capName;
      if (vendorName in style) return vendorName;
    }

    return name;
  }

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
    var args = arguments,
      prop,
      value;

    if (args.length == 2) {
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

/*
 * Export
 */

NProgress.configure = configure;
NProgress.isStarted = isStarted;
NProgress.set = set;
NProgress.settings = Settings;
NProgress.inc = inc;
NProgress.trickle = trickle;

export default NProgress;
