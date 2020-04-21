import { removeElement, addClass, removeClass } from "./dom";
import { queue } from "./queue";
import {
  toBarPerc,
  barPositionCSS,
  clamp,
  getPositioningCSS,
} from "./utilities";
import setCSS from "./css";

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
  let key;

  for (key in options) {
    let value = options[key];
    if (value !== undefined && options.hasOwnProperty(key))
      Settings[key] = value;
  }

  return NProgress;
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

  var progress = render(!started),
    bar = progress.querySelector(Settings.barSelector),
    speed = Settings.speed,
    ease = Settings.easing;

  progress.offsetWidth; /* Repaint */

  queue(function (next) {
    // Add transition
    const css = barPositionCSS(
      Settings.positionUsing || getPositioningCSS(),
      n,
      speed,
      ease
    );

    setCSS(bar, css);

    if (n === 1) {
      // Fade out
      setCSS(progress, {
        transition: "none",
        opacity: 1,
      });
      progress.offsetWidth; /* Repaint */

      setTimeout(function () {
        setCSS(progress, {
          transition: "all " + speed + "ms linear",
          opacity: 0,
        });
        setTimeout(function () {
          remove();
          next();
        }, speed);
      }, speed);
    } else {
      setTimeout(next, speed);
    }
  });

  return NProgress;
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

  return NProgress;
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
  if (!force && !NProgress.status) return NProgress;

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

/**
 * @return {HTMLElement}
 */

function getParent() {
  if (typeof Settings.parent === "string") {
    let parent = document.querySelector(Settings.parent);
    if (!parent)
      throw new Error(`NProgress: Invalid parent '${Settings.parent}'`);
    return parent;
  } else {
    return Settings.parent;
  }
}

/**
 * (Internal) renders the progress bar markup based on the `template`
 * setting.
 *
 * @param {boolean=} fromStart If true, then it will reset to 0% before starting
 */

function render(fromStart) {
  if (isRendered()) return document.getElementById("nprogress");

  addClass(document.documentElement, "nprogress-busy");

  var progress = document.createElement("div");
  progress.id = "nprogress";
  progress.innerHTML = Settings.template;

  /** @type HTMLElement | null */
  let bar = progress.querySelector(Settings.barSelector);
  if (!bar)
    throw new Error(`NProgress: No bar found for '${Settings.barSelector}'`);

  let perc = fromStart ? "-100" : toBarPerc(NProgress.status || 0);

  /** @type HTMLElement */
  let parent = getParent();

  /** @type HTMLElement | null */
  let spinner;

  setCSS(bar, {
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
}

/**
 * Removes the element. Opposite of render().
 */

function remove() {
  removeClass(document.documentElement, "nprogress-busy");
  removeClass(
    document.querySelector(Settings.parent),
    "nprogress-custom-parent"
  );

  let progress = document.getElementById("nprogress");
  progress && removeElement(progress);
}

/**
 * Checks if the progress bar is rendered.
 */

function isRendered() {
  return !!document.getElementById("nprogress");
}

// Default export for commonjs / import NProgress
NProgress.configure = configure;
NProgress.inc = inc;
NProgress.isRendered = isRendered;
NProgress.isStarted = isStarted;
NProgress.remove = remove;
NProgress.render = render;
NProgress.set = set;
NProgress.settings = Settings;
NProgress.trickle = inc;

// Export for ESM
export {
  configure,
  inc,
  inc as trickle,
  isRendered,
  isStarted,
  remove,
  render,
  set,
  Settings as settings,
};

export default NProgress;
