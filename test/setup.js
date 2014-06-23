global.chai = require('chai');
global.assert = chai.assert;
chai.should();

var fs = require('fs');

var scripts = {
  'nprogress': fs.readFileSync('nprogress.js')
};

function myEnv() {
  var jsdom = require('jsdom');
  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body></body></html>',
      src: [ scripts.nprogress ],
      done: function(errors, window) {
        window.console = console;
        global.window  = window;
        global.$       = window.$;
        global.jQuery  = window.jQuery;
        global.NProgress = window.NProgress;
        done(errors);
      }
    });
  };
}

before(myEnv());
global.testSuite = describe;
