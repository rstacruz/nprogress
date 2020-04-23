import NProgress, { _setPercent } from "./nprogress";

jest.useFakeTimers();

const all = (sel) => document.querySelectorAll(sel);
const qs = (sel) => document.querySelector(sel);

const remove = (el) => {
  if (el && el.parentNode) el.parentNode.removeChild(el);
};

let defaults;

beforeEach(() => {
  defaults = { ...NProgress.settings };
});

afterEach(() => {
  remove(qs("#nprogress"));
  _setPercent(null);
  Object.assign(NProgress.settings, defaults);
});

describe("set()", () => {
  it(".set(0) must render", () => {
    NProgress.set(0);
    expect(all("#nprogress").length).toEqual(1);
    expect(all("#nprogress .bar").length).toEqual(1);
    expect(all("#nprogress .peg").length).toEqual(1);
    expect(all("#nprogress .spinner").length).toEqual(1);
  });

  it(".set(1) should appear and disappear", async () => {
    NProgress.configure({ speed: 10 });
    NProgress.set(0).set(1);
    expect(all("#nprogress").length).toEqual(1);
    jest.runTimersToTime(100);
    expect(all("#nprogress").length).toEqual(0);
  });

  it("must respect minimum", () => {
    NProgress.set(0);
    expect(NProgress.getPercent()).toEqual(NProgress.settings.minimum);
  });

  it("must clamp to minimum", () => {
    NProgress.set(-100);
    expect(NProgress.getPercent()).toEqual(NProgress.settings.minimum);
  });

  it("must clamp to maximum", () => {
    NProgress.set(400);
    expect(NProgress.getPercent()).toEqual(null);
  });
});

describe(".start()", function () {
  it("must render", function (done) {
    NProgress.start();
    expect(all("#nprogress").length).toEqual(1);
    done();
  });

  it("must respect minimum", function () {
    NProgress.start();
    expect(NProgress.getPercent()).toEqual(NProgress.settings.minimum);
  });
});

describe("with specific parent", () => {
  /** @type HTMLElement */
  let test;

  beforeEach(() => {
    test = document.createElement("div");
    test.id = "test";
    document.body.appendChild(test);
  });

  it("must be attached to specified parent", function () {
    NProgress.configure({ parent: "#test" });
    NProgress.start();

    expect(qs("#nprogress").parentNode).toEqual(test);
    expect(test.classList.contains("nprogress-custom-parent")).toBeTruthy();
  });
});

describe(".done()", () => {
  it("must not render without start", () => {
    NProgress.done();
    expect(all("#nprogress").length).toEqual(0);
  });

  it(".done(true) must render", () => {
    NProgress.done(true);
    expect(all("#nprogress").length).toEqual(1);
  });
});

describe(".remove()", function () {
  it("should be removed from the parent", function () {
    var parent = qs(NProgress.settings.parent);

    NProgress.set(1);
    expect(parent.className).toEqual("");
    expect(parent.querySelectorAll("#nprogress").length).toEqual(1);

    NProgress.remove();
    expect(parent.className).toEqual("");
    expect(parent.querySelectorAll("#nprogress").length).toEqual(0);
  });
});

describe(".inc()", function () {
  it("should render", function () {
    NProgress.inc();
    expect(all("#nprogress").length).toEqual(1);
  });

  it("should start with minimum", function () {
    NProgress.inc();
    expect(NProgress.getPercent()).toEqual(NProgress.settings.minimum);
  });

  it("should increment", function () {
    NProgress.start();

    let start = NProgress.getPercent();
    NProgress.inc();

    expect(NProgress.getPercent()).toBeGreaterThan(start);
  });

  it("should never reach 1.0", function () {
    for (let i = 0; i < 100; ++i) {
      NProgress.inc();
    }

    expect(NProgress.getPercent()).toBeLessThan(1);
  });
});

describe(".configure()", function () {
  it("should work", function () {
    NProgress.configure({ minimum: 0.5 });
    expect(NProgress.settings.minimum).toEqual(0.5);
  });
});

describe(".configure(showSpinner)", function () {
  it("should render spinner by default", function () {
    NProgress.start();
    expect(all("#nprogress .spinner").length).toEqual(1);
  });

  it("should be true by default", function () {
    expect(NProgress.settings.showSpinner).toEqual(true);
  });

  it("should hide (on false)", function () {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    expect(all("#nprogress .spinner").length).toEqual(0);
  });
});
