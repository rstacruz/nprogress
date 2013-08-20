NProgress
=========

Progress bar animation.

Installation
------------

Add jQuery (1.8 or above), [nprogress.js] and [nprogress.css] to your project.

Basic usage
-----------

Simply call `start()` and `done()` to control the progress bar.

~~~ js
NProgress.start();
NProgress.done();
~~~

Using [Turbolinks] or similar? Use this:

~~~ js
$(document).on('page:fetch', function() { NProgress.start(); });
$(document).on('page:load',  function() { NProgress.done(); });
~~~

Ideas
-----

 * Add progress to your Ajax calls! Bind it to the jQuery `ajaxStart` and
 `ajaxComplete` events.

 * Make a fancy loading bar even without Turbolinks/Pjax! Bind it to
 `$(document).ready` and `$(window).load`.

Advanced usage
--------------

__Percentages:__ To set a progress percentage, call `.set(n)`, where *n* is a
number between `0..1`.

~~~ js
NProgress.set(0.0);     // Sorta same as .start()
NProgress.set(0.4);
NProgress.set(1.0);     // Sorta same as .done()
~~~

__Incrementing:__ To increment the progress bar, just use `.inc()`. This
increments it with a random amount. This will never get to 100%: use it for
every image load (or similar).

~~~ js
NProgress.inc();
~~~

__Force-done:__ By passing `true` to `done()`, it will show the progress bar
even if it's not being shown. (The default behavior is that *.done()* will not
    do anything if *.start()* isn't called)

~~~ js
NProgress.done(true);
~~~

Configuration
-------------

Change the minimum percentage using `minimum`.

~~~ js
NProgress.configure({ minimum: 0.1 });
~~~

You can change the markup using `template`. To keep the progress
bar working, keep an element with `role='bar'` in there.

~~~ js
NProgress.configure({
  template: "<div class='....'>...</div>"
});
~~~

Adjust animation settings using `ease` (a CSS easing string) and `speed` (in 
    ms).

~~~ js
NProgress.configure({ ease: 'ease', speed: 500 });
~~~

Want to turn off trickling? Set `trickleSpeed` to 0. Alternatively, set it to a
number between `0...1` to adjust how fast the progress trickles.

~~~ js
NProgress.configure({ trickleSpeed: 0 });
~~~

Customization
-------------

Just edit `nprogress.css` to your liking. Tip: you probably only want to find
and replace occurances of `#29d`.

The included CSS file is pretty minimal... in fact, feel free to scrap it and
make your own!

Resources
---------

 * [New UI Pattern: Website Loading
 Bars](http://www.usabilitypost.com/2013/08/19/new-ui-pattern-website-loading-bars/) (usabilitypost.com)

Acknowledgements
----------------

(c) 2013 Rico Sta. Cruz, MIT License

[Turbolinks]: https://github.com/rails/turbolinks
[nprogress.js]: nprogress.js
[nprogress.css]: nprogress.css

