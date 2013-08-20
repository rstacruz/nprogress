NProgress
=========

Progress bar animation.

Installation
------------

Add jQuery, [nprogress.js] and [nprogress.css] to your project.

Usage
-----

Simply call show and hide to display the progress bar.

~~~ js
NProgress.show();
NProgress.hide();
~~~

Using [Turbolinks] or similar?

~~~ js
$(document).on('page:fetch', function() { NProgress.show(); });
$(document).on('page:load', function() { NProgress.hide(); });
~~~

### Percentages

Just call `.set(n)`, where *n* is a number between `0..1`.

~~~ js
NProgress.set(0.4);
NProgress.set(1.0);     // Same as .hide()
~~~

To increment the progress bar, just use `.inc()`. This increments it with a 
random amount.

~~~ js
NProgress.inc();
~~~

[Turbolinks]: https://github.com/rails/turbolinks
[nprogress.js]: nprogress.js
[nprogress.css]: nprogress.css
