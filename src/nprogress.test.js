import NProgress from "./nprogress";

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
  NProgress.status = null;
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
    expect(NProgress.status).toEqual(NProgress.settings.minimum);
  });

  it("must clamp to minimum", () => {
    NProgress.set(-100);
    expect(NProgress.status).toEqual(NProgress.settings.minimum);
  });

  it("must clamp to maximum", () => {
    NProgress.set(400);
    expect(NProgress.status).toEqual(null);
  });
});

describe(".start()", function () {
  // it('must render', function(done) {
  //   NProgress.start();
  //   assert.equal($("#nprogress").length, 1);
  //   done();
  // });
  // it('must respect minimum', function() {
  //   NProgress.start();
  //   assert.equal(NProgress.status, NProgress.settings.minimum);
  // });
  // it('must be attached to specified parent', function() {
  //   var test = $('<div>', {id: 'test'}).appendTo('body');
  //   NProgress.configure({parent: '#test'});
  //   NProgress.start();
  //   assert.isTrue($("#nprogress").parent().is(test));
  //   assert.isTrue($(NProgress.settings.parent).hasClass("nprogress-custom-parent"));
  // });
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

  // it('should start with minimum', function() {
  //   NProgress.inc();
  //   assert.equal(NProgress.status, NProgress.settings.minimum);
  // });
  // it('should increment', function() {
  //   NProgress.start();
  //   var start = NProgress.status;
  //   NProgress.inc();
  //   assert.operator(NProgress.status, '>', start);
  // });
  // it('should never reach 1.0', function() {
  //   for (var i=0; i<100; ++i) { NProgress.inc(); }
  //   assert.operator(NProgress.status, '<', 1.0);
  // });
});

describe(".configure()", function () {
  it("should work", function () {
    NProgress.configure({ minimum: 0.5 });
    expect(NProgress.settings.minimum).toEqual(0.5);
  });
});

// // ----

describe(".configure(showSpinner)", function () {
  // it('should render spinner by default', function() {
  //   NProgress.start();
  //   assert.equal($("#nprogress .spinner").length, 1);
  // });
  // it('should be true by default', function() {
  //   assert.equal(NProgress.settings.showSpinner, true);
  // });
  // it('should hide (on false)', function() {
  //   NProgress.configure({ showSpinner: false });
  //   NProgress.start();
  //   assert.equal($("#nprogress .spinner").length, 0);
  // });
  // });
});
