NProgress
=========

Progress bar animation.

Installation
------------

Add jQuery (1.8 or above), [nprogress.js] and [nprogress.css] to your project.

Usage
-----

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

### Percentages

Just call `.set(n)`, where *n* is a number between `0..1`.

~~~ js
NProgress.set(0.0);     // Same as .start()
NProgress.set(0.4);
NProgress.set(1.0);     // Same as .done()
~~~

### Incrementing

To increment the progress bar, just use `.inc()`. This increments it with a 
random amount.

~~~ js
NProgress.inc();
~~~

[Turbolinks]: https://github.com/rails/turbolinks
[nprogress.js]: nprogress.js
[nprogress.css]: nprogress.css
