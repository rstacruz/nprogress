(function(NProgress) {

  this.NProgress = NProgress;

})(function($) {
  var NProgress = {};

  var Settings = NProgress.settings = {
    minimum: 0.1,
    exitmode: 'full',
    easing: 'ease',
    speed: 300,
    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner"><div></div></div>'
  };

  /**
   * Updates configuration.
   *
   *     NProgress.configure({
   *       minimum: 0.1
   *     });
   */
  NProgress.configure = function(options) {
    $.extend(Settings, options);
  };

  NProgress.status = null;

  /**
   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
   *
   *     NProgress.set(0.4);
   *     NProgress.set(1.0);
   */

  NProgress.set = function(n) {
    n = clamp(n, Settings.minimum, 1);
    NProgress.status = n;

    var $progress = NProgress.render(),
        $bar      = $progress.find('[role~="bar"]'),
        speed     = Settings.speed,
        ease      = Settings.easing;

    setTimeout(function() {
    $("#nprogress").queue(function(next) {
      // Get percentage
      var perc = -1 + n; /* -1.0 ... 0 */
      // if (perc === 0) perc = 1.0;

      $bar.css({
        transition: 'all '+speed+'ms '+ease,
        transform: 'translate3d('+(perc*100)+'%,0,0)'
      });

      if (n === 1) {
        $progress.css({ transition: 'none', opacity: 1 });

        setTimeout(function() {
          $progress.css({ transition: 'all '+speed+'ms linear', opacity: 0 });
          setTimeout(function() {
            $progress.remove();
            next();
          }, speed);
        }, speed);
      } else {
        setTimeout(next, speed);
      }
    });
    }, 0);
  };

  /**
   * Hides the progress bar.
   *
   *     NProgress.hide();
   */

  NProgress.hide = function() {
    return NProgress.set(1);
  };

  /**
   * (Internal) renders the progress bar markup based on the `template`
   * setting.
   */

  NProgress.render = function() {
    if (NProgress.isRendered()) return $("#nprogress");

    var $el = $("<div id='nprogress'>")
      .html(Settings.template)
      .appendTo(document.body);

    $el.find('[role~="bar"]').css({
      transition: 'all 0 linear',
      transform: 'translate3d(-100%,0,0)'
    });

    $el[0].innerWidth;

    return $el;
  };

  /**
   * Checks if the progress bar is rendered.
   */

  NProgress.isRendered = function() {
    return ($("#nprogress").length > 0);
  };

  /**
   * Shows the progress bar.
   *
   */
  NProgress.show = function() {
    return NProgress.set(NProgress.settings.minimum);
  };

  /**
   * Helpers
   */

  function clamp(n, min, max) {
    if (n < min) return min;
    if (n > max) return max;
    return n;
  }

  return NProgress;
}(jQuery));

