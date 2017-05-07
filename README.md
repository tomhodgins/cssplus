# CSSplus

CSSplus is a collection of CSS Reprocessor plugins that dynamically update CSS variables.

Included are the following plugins:

- [cursory](#cursory)
- [scrollery](#scrollery)
- [selectory](#selectory)
- [varsity](#varsity)

## Usage

### NPM

If you are using NPM you can include all CSSplus plugins by including the entire package:

```javascript
const cssplus = require('cssplus')
```

But to include individual plugins you can use the `module/submodule` syntax:

```javascript
const selectory = require('cssplus/selectory')
```

### Global JavaScript

To include CSSplus plugins you have to include a `<script>` tag to each plugin you want to include. If you want to include just `Selectory` you would include just:

```html
<script src=cssplus/selectory.js></script>
```

And to include all CSSplus plugins, use the following list:

```html
<script src=cssplus/cursory.js></script>
<script src=cssplus/scrollery.js></script>
<script src=cssplus/selectory.js></script>
<script src=cssplus/varsity.js></script>
```


## Varsity - scoped variables


## Cursory - mouse/touch cursor variables


## Scrollery - scroll position variables


## Selectory - a JS selector resolver