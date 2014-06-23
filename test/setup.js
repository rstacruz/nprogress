global.chai = require('chai');
global.assert = chai.assert;
chai.should();

var fs = require('fs');

var scripts = {
  'jq-2.0':  fs.readFileSync('vendor/jquery-2.0.js'),
  'nprogress': fs.readFileSync('nprogress.js')
};

function myEnv() {
  var jsdom = require('jsdom');
  return function(done) {
    jsdom.env({
      html: '<!doctype html><html><head></head><body></body></html>',
      src: [ scripts['jq-2.0'], scripts.nprogress ],
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
