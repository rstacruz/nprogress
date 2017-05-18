NProgress
=========

[![Status](https://api.travis-ci.org/rstacruz/nprogress.svg?branch=master)](http://travis-ci.org/rstacruz/nprogress) 
[![npm version](https://img.shields.io/npm/v/nprogress.png)](https://npmjs.org/package/nprogress "View this project on npm")
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/nprogress/badge?style=rounded)](https://www.jsdelivr.com/package/npm/nprogress)

> Minimalist progress bar

Slim progress bars for Ajax'y applications. Inspired by Google, YouTube, and
Medium.

Installation
------------

Add [nprogress.js] and [nprogress.css] to your project.

```html
<script src='nprogress.js'></script>
<link rel='stylesheet' href='nprogress.css'/>
```

NProgress is available via [bower] and [npm].

    $ npm install --save nprogress

Also available via [unpkg] CDN:

- https://unpkg.com/nprogress@0.2.0/nprogress.js
- https://unpkg.com/nprogress@0.2.0/nprogress.css

[bower]: http://bower.io/search/?q=nprogress
[npm]: https://www.npmjs.org/package/nprogress
[unpkg]: https://unpkg.com/

Basic usage
-----------
you should instantiate the progress bar
~~~ js
var nprogress = NProgress();
~~~

then Simply call `start()` and `done()` to control the progress bar.

~~~ js
nprogress.start();
nprogress.done();
~~~

### Turbolinks (version 5+)
Ensure you're using Turbolinks 5+, and use
this: (explained [here](https://github.com/rstacruz/nprogress/issues/8#issuecomment-239107109))

~~~ js
$(document).on('turbolinks:click', function() {
  nprogress.start();
});
$(document).on('turbolinks:render', function() {
  nprogress.done();
  nprogress.remove();
});
~~~

### Turbolinks (version 3 and below)
Ensure you're using Turbolinks 1.3.0+, and use
this: (explained [here](https://github.com/rstacruz/nprogress/issues/8#issuecomment-23010560))

~~~ js
$(document).on('page:fetch',   function() { nprogress.start(); });
$(document).on('page:change',  function() { nprogress.done(); });
$(document).on('page:restore', function() { nprogress.remove(); });
~~~

### Pjax
Try this: (explained [here](https://github.com/rstacruz/nprogress/issues/22#issuecomment-36540472))

~~~ js
$(document).on('pjax:start', function() { nprogress.start(); });
$(document).on('pjax:end',   function() { nprogress.done();  });
~~~

Ideas
-----

 * Add progress to your Ajax calls! Bind it to the jQuery `ajaxStart` and
 `ajaxStop` events.

 * Make a fancy loading bar even without Turbolinks/Pjax! Bind it to
 `$(document).ready` and `$(window).load`.

Advanced usage
--------------

__Percentages:__ To set a progress percentage, call `.set(n)`, where *n* is a
number between `0..1`.

~~~ js
var nprogress = NProgress();
nprogress.set(0.0);     // Sorta same as .start()
nprogress.set(0.4);
nprogress.set(1.0);     // Sorta same as .done()
~~~

__Incrementing:__ To increment the progress bar, just use `.inc()`. This
increments it with a random amount. This will never get to 100%: use it for
every image load (or similar).

~~~ js
nprogress.inc();
~~~

If you want to increment by a specific value, you can pass that as a parameter:

~~~ js
nprogress.inc(0.2);    // This will get the current status value and adds 0.2 until status is 0.994
~~~

__Force-done:__ By passing `true` to `done()`, it will show the progress bar
even if it's not being shown. (The default behavior is that *.done()* will not
    do anything if *.start()* isn't called)

~~~ js
nprogress.done(true);
~~~

__Get the status value:__ To get the status value, use `.status`

Configuration
-------------

#### `minimum`
Changes the minimum percentage used upon starting. (default: `0.08`)

~~~ js
nprogress.configure({ minimum: 0.1 });
~~~

#### `template`
You can change the markup using `template`. To keep the progress
bar working, keep an element with `role='bar'` in there. See the [default template]
for reference.

~~~ js
nprogress.configure({
  template: "<div class='....'>...</div>"
});
~~~

#### `easing` and `speed`
Adjust animation settings using *easing* (a CSS easing string)
and *speed* (in ms). (default: `ease` and `200`)

~~~ js
nprogress.configure({ easing: 'ease', speed: 500 });
~~~

#### `trickle`
Turn off the automatic incrementing behavior by setting this to `false`. (default: `true`)

~~~ js
nprogress.configure({ trickle: false });
~~~

#### `trickleSpeed`
Adjust how often to trickle/increment, in ms.

~~~ js
nprogress.configure({ trickleSpeed: 200 });
~~~

#### `showSpinner`
Turn off loading spinner by setting it to false. (default: `true`)

~~~ js
nprogress.configure({ showSpinner: false });
~~~

#### `parent`
specify this to change the parent container. (default: `body`)

~~~ js
nprogress.configure({ parent: '#container' });
~~~

Also this is useful when you want to have multi progress bar in your page you need to give different parent for each
~~~ js
var nprogress1 = NProgress();
var nprogress2 = NProgress();

nprogress1.configure({ parent: '#container1' });
nprogress2.configure({ parent: '#container2' });
~~~
Customization
-------------

Just edit `nprogress.css` to your liking. Tip: you probably only want to find
and replace occurrences of `#29d`.

The included CSS file is pretty minimal... in fact, feel free to scrap it and
make your own!

Resources
---------

 * [New UI Pattern: Website Loading Bars](http://www.usabilitypost.com/2013/08/19/new-ui-pattern-website-loading-bars/) (usabilitypost.com)

Support
-------

__Bugs and requests__: submit them through the project's issues tracker.<br>
[![Issues](http://img.shields.io/github/issues/rstacruz/nprogress.svg)]( https://github.com/rstacruz/nprogress/issues )

__Questions__: ask them at StackOverflow with the tag *nprogress*.<br>
[![StackOverflow](http://img.shields.io/badge/stackoverflow-nprogress-brightgreen.svg)]( http://stackoverflow.com/questions/tagged/nprogress )

__Chat__: join us at gitter.im.<br>
[![Chat](http://img.shields.io/badge/gitter-rstacruz/nprogress-brightgreen.svg)]( https://gitter.im/rstacruz/nprogress )

[default template]: https://github.com/rstacruz/nprogress/blob/master/nprogress.js#L31

[Turbolinks]: https://github.com/rails/turbolinks
[nprogress.js]: http://ricostacruz.com/nprogress/nprogress.js
[nprogress.css]: http://ricostacruz.com/nprogress/nprogress.css

Thanks
------

**NProgress** © 2013-2017, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT License]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/nprogress/contributors

[![](https://img.shields.io/github/followers/rstacruz.svg?style=social&label=@rstacruz)](https://github.com/rstacruz) &nbsp;
[![](https://img.shields.io/twitter/follow/rstacruz.svg?style=social&label=@rstacruz)](https://twitter.com/rstacruz)
