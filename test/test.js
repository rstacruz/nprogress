if (typeof module === 'object') require('./setup');

testSuite('NProgress', function() {

  afterEach(function() {
    $("#nprogress").remove();
    NProgress.status = null;
  });

  it('.set(0) must render', function(done) {
    NProgress.set(0);
    assert.equal($("#nprogress").length, 1);
    assert.equal($("#nprogress .bar").length, 1);
    assert.equal($("#nprogress .peg").length, 1);
    assert.equal($("#nprogress .spinner").length, 1);
    done();
  });

  it('.set(0) must respect minimum', function() {
    NProgress.set(0);
    assert.equal(NProgress.status, NProgress.settings.minimum);
  });

  it('.configure() should work', function() {
    NProgress.configure({ minimum: 0.5 });
    assert.equal(NProgress.settings.minimum, 0.5);
  });

  it('.set(1) should appear and disappear', function(done) {
    NProgress.configure({ speed: 10 });
    NProgress.set(0).set(100);
    assert.equal($("#nprogress").length, 1);

    setTimeout(function() {
      assert.equal($("#nprogress").length, 0);
      done();
    }, 50);
  });
});
