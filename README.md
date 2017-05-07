# CSSplus

CSSplus is a collection of CSS Reprocessor plugins that dynamically update CSS variables.

Included are the following plugins:

- [cursory](#cursory---mousetouch-cursor-variables)
- [scrollery](#scrollery---scroll-position-variables)
- [selectory](#selectory---a-selector-resolver)
- [varsity](#varsity---scoped-variables)


## Usage


### NPM

If you are using NPM you can include all CSSplus plugins by including the entire package:

```javascript
const cssplus = require('cssplus')
```

If you include `cssplus` with all plugins like this, you are able to use each plugin from your own code like this:

```javascript
cssplus.selectory()
```

But to include the plugins individually you can use the `module/submodule` syntax:

```javascript
const selectory = require('cssplus/selectory')
```

And this means the plugin is available to be used as:

```javascript
selectory()
```


### Global JavaScript

To include CSSplus plugins globally (outside of a module loader like webpack) you must include a `<script>` tag to each plugin you want to use. If you want to include just `Selectory` for example you would include just the one file like this:

```html
<script src=cssplus/selectory.js></script>
```

To include all CSSplus plugins, you'll need to include links to the following files:

```html
<script src=cssplus/cursory.js></script>
<script src=cssplus/scrollery.js></script>
<script src=cssplus/selectory.js></script>
<script src=cssplus/varsity.js></script>
```


## Cursory: mouse/touch cursor variables

Cursory is a CSS reprocessor that makes the following JS values available as CSS variables:

- `cursorX`
- `cursorY`
- `innerWidth`
- `innerHeight`

These can be used as CSS variables with the following names:

- `--cursorX`
- `--cursorY`
- `--innerWidth`
- `--innerHeight`

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

- Test available at [test/cursory.html](http://tomhodgins.github.io/cssplus/test/cursory.html)


## Scrollery: scroll position variables

Scrollery is a CSS reprocessor that makes the following JS values available as CSS variables for any element you tell the plugin to watch:

- `scrollWidth`
- `scrollHeight`
- `scrollLeft`
- `scrollTop`

To have `scrollery` watch an element, you need to give that element a unique identifier, as well as add the `data-scrollery` attribute. The plugin will use either the value of the `data-scrollery` attribute, or else the value of the ID (if defined) for an element.

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

- Test available at [test/scrollery.html](http://tomhodgins.github.io/cssplus/test/scrollery.html)


## Selectory: a selector resolver

Selectory is a CSS reprocessor that resolves selectors using JS. This plugin will read CSS selectors that end with a `[test]` attribute and use JavaScript to determine whether or not to apply that style to elements matching the other part of that selector. For example, the JS test `1 == 1` will always resolve to `true`, so a selector written for `div[test="1 == 1"] {}` will always apply to each `div`  element.

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

- Test available at [test/selectory.html](http://tomhodgins.github.io/cssplus/test/selectory.html)

Apply a rule to an `h3` element when it contains at least one `span` element

```css
h3[test="(this.querySelector('span'))"] {
  color: red;
}
```

It is limited what selectors you can use with Selectory, things like `:hover` and pseudo-classes tend not to work as well. As well the parsing only allows for 1 test per selector, and complex selectors may not work as intended. Using `selector[test=""] {}` with a simple selector is best.


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

To have `varsity` watch an element, you need to give that element a unique identifier, as well as add the `data-varsity` attribute. The plugin will use either the value of the `data-varsity` attribute, or else the value of the ID (if defined) for an element.

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

- Test available at [test/varsity.html](http://tomhodgins.github.io/cssplus/test/varsity.html)