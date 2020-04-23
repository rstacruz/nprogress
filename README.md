<h1 align='center'>
NProgress
</h1>

<p align='center'>
Minimalist progress bar
</p>

<p align='center'>

<a href='https://travis-ci.org/rstacruz/nprogress' title='Travis CI'>
<img src='https://api.travis-ci.org/rstacruz/nprogress.svg?branch=master' alt='Build status'>
</a>

<a href='https://npmjs.org/package/nprogress' title='View this project on npm'>
<img src='https://img.shields.io/npm/v/nprogress.png' alt='npm version'>
</a>

<a href='https://www.jsdelivr.com/package/npm/nprogress'>
<img src='https://data.jsdelivr.com/v1/package/npm/nprogress/badge?style=rounded' alt='jsDelivr hits'>
</a>

</p>

Slim progress bars for web applications. Inspired by Google, YouTube, and
Medium.


<details>
<summary><strong>Table of contents</strong></summary>

<!-- toc -->

- [Installation](#installation)
- [Basic API](#basic-api)
- [Integration](#integration)
  * [Turbolinks (version 5+)](#turbolinks-version-5)
  * [Turbolinks (v3 and below)](#turbolinks-v3-and-below)
  * [Pjax](#pjax)
  * [jQuery AJAX](#jquery-ajax)
- [CSS styling](#css-styling)
  * [CSS variables](#css-variables)
  * [Sass](#sass)
- [Advanced API](#advanced-api)
  * [`set()`](#set)
  * [`inc()`](#inc)
  * [`done(true)`](#donetrue)
  * [`getPercent()`](#getpercent)
- [Configuration](#configuration)
    + [`minimum`](#minimum)
    + [`template`](#template)
    + [`easing` and `speed`](#easing-and-speed)
    + [`trickle`](#trickle)
    + [`trickleSpeed`](#tricklespeed)
    + [`showSpinner`](#showspinner)
    + [`parent`](#parent)
- [Customization examples](#customization-examples)
- [Resources](#resources)
- [Thanks](#thanks)

<!-- tocstop -->

</details>

## Installation

NProgress is available via [npm].

```sh
npm install --save nprogress
```

<details>
<summary>ES modules</summary>

```js
import * as NProgress from "nprogress";
```

```css
@import "~nprogress/css/nprogress.css";
```

</details>

<details>
<summary>Sass</summary>

```scss
$nprogress-color: #29d;
@import "~nprogress/css/nprogress.scss";
```

</details>

<details>
<summary>UMD build (via CDN)</summary>

```html
<script src="nprogress.js"></script>
<link rel="stylesheet" href="nprogress.css" />
```

Also available via [jsdelivr] CDN:

- https://cdn.jsdelivr.net/npm/nprogress@next/dist/nprogress.umd.js
- https://cdn.jsdelivr.net/npm/nprogress@next/css/nprogress.css

</details>

## Basic API

Call `start()` and `done()` to control the progress bar.

```js
NProgress.start();
NProgress.done();
```

## Integration

<details>
<summary>Turbolinks (version 5+)</summary>

### Turbolinks (version 5+)

Ensure you're using Turbolinks 5+, and use
this: (explained [here](https://github.com/rstacruz/nprogress/issues/8#issuecomment-239107109))

```js
$(document).on("turbolinks:click", function () {
  NProgress.start();
});
$(document).on("turbolinks:render", function () {
  NProgress.done();
  NProgress.remove();
});
```

</details>

<details>
<summary>Turbolinks (v3 and below)</summary>

### Turbolinks (v3 and below)

Ensure you're using Turbolinks 1.3.0+, and use
this: (explained [here](https://github.com/rstacruz/nprogress/issues/8#issuecomment-23010560))

```js
$(document).on("page:fetch", function () {
  NProgress.start();
});
$(document).on("page:change", function () {
  NProgress.done();
});
$(document).on("page:restore", function () {
  NProgress.remove();
});
```

</details>

<details>
<summary>Pjax</summary>

### Pjax

Try this: (explained [here](https://github.com/rstacruz/nprogress/issues/22#issuecomment-36540472))

```js
$(document).on("pjax:start", function () {
  NProgress.start();
});
$(document).on("pjax:end", function () {
  NProgress.done();
});
```

</details>

<details>
<summary>jQuery AJAX</summary>

### jQuery AJAX

```js
$(document).on("ajaxStart", function () {
  NProgress.start();
});
$(document).on("ajaxStop", function () {
  NProgress.done();
});
```

</details>

## CSS styling

Colors can be customized using CSS variables.

### CSS variables

```css
#nprogress {
  --nprogress-color: #29d;
  --nprogress-height: 2px;
  --nprogress-spinner-opacity: 1;
  --nprogress-spinner-size: 18px;
  --nprogress-spinner-stroke-width: 2px;
}
```

### Sass

```css
$nprogress-color: #29d;
```


## Advanced API

<details>
<summary>set()</summary>

### `set()`

**Percentages:** To set a progress percentage, call `.set(n)`, where _n_ is a
number between `0..1`.

```js
NProgress.set(0.0); // Sorta same as .start()
NProgress.set(0.4);
NProgress.set(1.0); // Sorta same as .done()
```

</details>

<details>
<summary>inc()</summary>

### `inc()`

**Incrementing:** To increment the progress bar, just use `.inc()`. This
increments it with a random amount. This will never get to 100%: use it for
every image load (or similar).

```js
NProgress.inc();
```

If you want to increment by a specific value, you can pass that as a parameter:

```js
NProgress.inc(0.2); // This will get the current status value and adds 0.2 until status is 0.994
```

</details>

<details>
<summary>done(true)</summary>

### `done(true)`

**Force-done:** By passing `true` to `done()`, it will show the progress bar
even if it's not being shown. (The default behavior is that _.done()_ will not
do anything if _.start()_ isn't called)

```js
NProgress.done(true);
```

</details>

<details>
<summary>getPercent()</summary>

### `getPercent()`

**Get the current percentage:** Use `getPercent()` to get the current value.

```js
console.log(NProgress.getPercent());
```

<details>

## Configuration

#### `minimum`

Changes the minimum percentage used upon starting. (default: `0.08`)

```js
NProgress.configure({ minimum: 0.1 });
```

#### `template`

You can change the markup using `template`. To keep the progress bar working, keep an element with `role='bar'` in there. See the [default template] for reference.

```js
NProgress.configure({
  template: "<div class='....'>...</div>",
});
```

#### `easing` and `speed`

Adjust animation settings using _easing_ (a CSS easing string) and _speed_ (in ms). (default: `ease` and `200`)

```js
NProgress.configure({ easing: "ease", speed: 500 });
```

#### `trickle`

Turn off the automatic incrementing behavior by setting this to `false`. (default: `true`)

```js
NProgress.configure({ trickle: false });
```

#### `trickleSpeed`

Adjust how often to trickle/increment, in ms.

```js
NProgress.configure({ trickleSpeed: 200 });
```

#### `showSpinner`

Turn off loading spinner by setting it to false. (default: `true`)

```js
NProgress.configure({ showSpinner: false });
```

#### `parent`

specify this to change the parent container. (default: `body`)

```js
NProgress.configure({ parent: "#container" });
```

## Customization examples

<details>
<summary>Hiding the spinner</summary>

```css
#nprogress {
  --nprogress-spinner-opacity: 0;
}
```

</details>

<details>
<summary>Changing the color</summary>

```css
#nprogress {
  --nprogress-color: #29d;
}
```

</details>

## Resources

- [New UI Pattern: Website Loading Bars](http://www.usabilitypost.com/2013/08/19/new-ui-pattern-website-loading-bars/) (usabilitypost.com)

[default template]: https://github.com/rstacruz/nprogress/blob/master/nprogress.js#L31
[turbolinks]: https://github.com/rails/turbolinks
[nprogress.js]: http://ricostacruz.com/nprogress/nprogress.js
[nprogress.css]: http://ricostacruz.com/nprogress/nprogress.css

## Thanks

**NProgress** © 2013-2020, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[mit license]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/nprogress/contributors

[![](https://img.shields.io/github/followers/rstacruz.svg?style=social&label=@rstacruz)](https://github.com/rstacruz) &nbsp;
[![](https://img.shields.io/twitter/follow/rstacruz.svg?style=social&label=@rstacruz)](https://twitter.com/rstacruz)

[npm]: https://www.npmjs.org/package/nprogress
[jsdelivr]: https://jsdelivr.com
