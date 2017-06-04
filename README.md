![](http://i.imgur.com/mOpaudj.png)

# CSSplus

CSSplus is a collection of CSS Reprocessor plugins that dynamically update CSS variables.

The plugins are designed to be used in tandem, though it's possible to pick and choose which plugins you want to include in each project.

Included are the following plugins:

- [**Aspecty:** aspect ratio property](#aspecty-an-aspect-ratio-property)
- [**Cursory:** mouse/touch cursor variables](#cursory-mousetouch-cursor-variables)
- [**Scrollery:** scroll position variables](#scrollery-scroll-position-variables)
- [**Selectory:** a selector resolver](#selectory-a-selector-resolver)
- [**Varsity:** scoped variables](#varsity-scoped-variables)
- [**Xpathy:** XPath selectors in CSS](#xpathy-xpath-selectors-in-css)

## Usage


### NPM

If you are using NPM you can include all CSSplus plugins by including the entire package:

```javascript
const cssplus = require('cssplus')
```

This will import all CSSplus plugins and make them available to be used in your own code as:

- `cssplus.aspecty`
- `cssplus.cursory`
- `cssplus.scrollery`
- `cssplus.selectory`
- `cssplus.varsity`
- `cssplus.xpathy`

But if you want to include the plugins individually, you can use the `module/submodule` syntax:

```javascript
const selectory = require('cssplus/selectory')
```

And this means the Selectory plugin is available to be used in your code as:

```javascript
selectory.load()
```


### Global JavaScript

To include CSSplus plugins globally (outside of a bundler like Webpack or Browserify) you must include a `<script>` tag to each plugin you want to use. If you want to include just `Selectory` for example you would include just the one file like this:

```html
<script src=cssplus/selectory.js></script>
```

To include all CSSplus plugins, you'll need to include links to the following files:

```html
<script src=cssplus/aspecty.js></script>
<script src=cssplus/cursory.js></script>
<script src=cssplus/scrollery.js></script>
<script src=cssplus/selectory.js></script>
<script src=cssplus/varsity.js></script>
<script src=cssplus/xpathy.js></script>
```


## Aspecty: an aspect ratio property

Aspecty is a CSS reprocessor that adds support for an aspect-ratio property using JS. This plugin allows you to define a desired aspect-ratio for an element, based on its rendered width on the page.

For any element with an aspect ratio defined, event listeners will be added to reprocess the styles on the following events:

- `mouseenter`
- `mouseleave`
- `mousedown`
- `mouseup`
- `focus`
- `blur`

By default, Aspecty will reprocess aspect ratios by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run Aspecty whenever you want, use the `aspecty.load()` function in JS.

The aspect ratio property can be used in CSS with the property name `--aspect-ratio` and a ratio, expressed as width and height as unitless numbers, separated by a slash `/`:

```css
--aspect-ratio: width/height;
```

You can use it in CSS like this:

```css
div {
  background: lime;
  --aspect-ratio: 16/9;
}
```

Aspecty will look through the document for any element matching the selector (in this case `div`) and create a new rule with a `height` value calculated based on each matching element's `offsetWidth` divided by the aspect ratio defined in CSS. To animate the effect of the `--aspect-ratio` property, which is actually applying via `height`, it is necessary to set a `transition` on the `height` property like this:

```css
transition: height .2s ease-in-out;
```
Test available at: [test/aspecty.html](http://tomhodgins.github.io/cssplus/test/aspecty.html)

## Cursory: mouse/touch cursor variables

Cursory is a CSS reprocessor that makes the following JS values available as CSS variables:

- `cursorX`
- `cursorY`
- `innerWidth`
- `innerHeight`
- `clicked`

These can be used as CSS variables with the following names:

- `--cursorX`
- `--cursorY`
- `--innerWidth`
- `--innerHeight`
- `--clicked`

These variables are updated at the following events:

- `mousemove`
- `touchmove`

In addition, the `--clicked` variable is changed from `0` to `1` between the `mousedown` and `touchstart` events and the corresponding `mouseup` or `touchend` events. This allows you to use the `var(--clicked)` ratio as a `1` or `0` in your CSS `calc()` functions, or as a value for `opacity:;` fairly easily.

To run Cursory whenever you want, use the `cursory.load()` function in JS.

To make an element like `div` follow the cursor position when using `cursory`, use CSS with variables like this:

```css
div {
  width: 10px;
  height: 10px;
  position: fixed;
  background: black;
  top: calc(var(--cursorY) * 1px);
  left: calc(var(--cursorX) * 1px);
}
```

Test available at: [test/cursory.html](http://tomhodgins.github.io/cssplus/test/cursory.html)


## Scrollery: scroll position variables

Scrollery is a CSS reprocessor that makes the following JS values available as CSS variables for any element you tell the plugin to watch:

- `scrollWidth`
- `scrollHeight`
- `scrollLeft`
- `scrollTop`

To have `scrollery` watch an element, you need to give that element a unique identifier, as well as add the `data-scrollery` attribute. The plugin will use either the value of the `data-scrollery` attribute, or else the value of the `id` (if defined) for an element.

By default, Scrollery will watch 0 elements. If you add a `data-scrollery` attribute to either the `<html>` or `<body>` element it will attach an event listener for the `scroll` event on the `window`, otherwise if you add the `data-scrollery` attribute to other elements it will add a `scroll` listener to that element.

To run Scrollery whenever you want, use the `scrollery.load()` function in JS.

```html
<div id=example data-scrollery></div>
```

And the following example are both equivalent, and resolve to a name of `example`:

```html
<div data-scrollery=example></div>
```

Once the plugin is aware of an element to watch, and the unique name of that element, it will make the above values available in the following format: `--name-value`, for `example`:

- `--example-scrollWidth`
- `--example-scrollHeight`
- `--example-scrollTop`
- `--example-scrollLeft`

Test available at: [test/scrollery.html](http://tomhodgins.github.io/cssplus/test/scrollery.html)


## Selectory: a selector resolver

Selectory is a CSS reprocessor that resolves selectors using JS. This plugin will read CSS selectors that end with a `[test]` attribute and use JavaScript to determine whether or not to apply that style to elements matching the other part of that selector. For example, the JS test `1 == 1` will always resolve to `true`, so a selector written for `div[test="1 == 1"] {}` will always apply to each `div`  element.

By default, Selectory will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run Selectory whenever you want, use the `selectory.load()` function in JS.

Other things you can do with Selectory include:

Apply a rule to a `div` when it is wider than 300px:

```css
div[test="this.offsetWidth > 300"] {
  background: orange;
}
```

Apply a rule to an `input` when its `value=""` attribute is greater than `30`:

```css
input[test="this.value > 30"] {
  background: lime;
}

```

Apply a rule to an `input` when it has a `value=""` attribute zero characters long:

```css
input[test="this.value.length == 0"] {
  background: purple;
}
```

Apply a rule to an `input` when its `value=""` attribute is more than 5 characters long:

```css
input[test="5 < this.value.length"] {
  background: turquoise;
}
```

Apply a rule to an `h3` element when it contains at least one `span` element:

```css
h3[test="(this.querySelector('span'))"] {
  color: red;
}
```

It is limited what selectors you can use with Selectory, things like `:hover` and pseudo-classes tend not to work as well. As well the parsing only allows for 1 test per selector, and complex selectors may not work as intended. Using `selector[test=""] {}` with a simple selector is best.

Test available at: [test/selectory.html](http://tomhodgins.github.io/cssplus/test/selectory.html)


## Varsity: scoped variables

Varsity is a CSS reprocessor that makes the following JS values available as CSS variables for any element you tell the plugin to watch:

- `offsetWidth`
- `offsetHeight`
- `offsetLeft`
- `offsetTop`
- `aspect-ratio`
- `characters`
- `children`
- `value`

By default, Varsity will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run Varsity whenever you want, use the `varsity.load()` function in JS.

To have `varsity` watch an element, you need to give that element a unique identifier, as well as add the `data-varsity` attribute. The plugin will use either the value of the `data-varsity` attribute, or else the value of the `id` (if defined) for an element.

```html
<div id=example data-varsity></div>
```

And the following example are both equivalent, and resolve to a name of `example`:

```html
<div data-varsity=example></div>
```

Once the plugin is aware of an element to watch, and the unique name of that element, it will make the above values available in the following format: `--name-value`, for `example`:

- `--example-offsetWidth`
- `--example-offsetHeight`
- `--example-offsetLeft`
- `--example-offsetTop`
- `--example-aspect-ratio`
- `--example-characters`
- `--example-children`
- `--example-value`

Test available at: [test/varsity.html](http://tomhodgins.github.io/cssplus/test/varsity.html)


## XPathy: XPath selectors in CSS

XPathy is a CSS reprocessor that resolves selectors using XPath. This plugin will read CSS selectors that end with a `[xpath]` attribute and use JavaScript and XPath to determine whether or not to apply that style to elements matching the other part of that selector. For example, the XPath selector `//div` will always resolve to `div`, so a selector written for `div [xpath="//div"] {}` will always apply to each `div div {}` element.

By default, XPathy will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run XPathy whenever you want, use the `xpathy.load()` function in JS.

Other things you can do with XPathy include:

Select all `span` tags with the XPath `//span`:

```css
[xpath="//span"] {
  color: violet;
}
```

Select all elements with a class name of `demo-class` with the XPath `//*[@class='demo-class']`:

```css
[xpath="//*[@class='demo-class']"] {
  color: lime;
}
```

Select an element with a text content of 'Demo Content' with the XPath `//*[text()='Demo Content']`:

```css
[xpath="//*[text()='Demo Content']"] {
  color: violet;
}
```

Select the parent element of another element with the XPath `/..`:

```css
[xpath="//*[@class='child']/.."] {
  border: 1px solid lime;
}
```

Compare attribute values as numbers with operators like `>` and `&lt;`:

```css
[xpath="//*[@data-price > 3]"] {
  color: violet;
}
```

Select elements based on the number of children they contain with an XPath like `//ul[li[4]]`:

```css
[xpath="//ul[li[4]]"] {
  color: lime;
}
```

Test available at: [test/xpathy.html](http://tomhodgins.github.io/cssplus/test/xpathy.html)


## Browser support

These plugins are written in ES6, and intended to be used in modern browsers (Chrome, Safari, Firefox, Edge) without transpilation. Many of these plugins make use of CSS Custom Properties (CSS variables) for functionality, so any browser that doesn't support these features will have trouble with.

As far as I am aware, the only browser that supports CSS Custom Properties but not the ES6 features used (where transpiling to ES5 might improve support) is for Mobile Safari (iOS) support.

Currently all of these plugins are under active development and things are shifting around quite a bit so browser support may change with each release.


## Demos

For 20+ CSSplus demos, check out the [CSSPlus demos collection](http://codepen.io/collection/XLbNKz/) on Codepen.