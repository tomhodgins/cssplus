
/*

# Varsity
## version 0.0.2

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

To run Varsity whenever you want, use the `varsity()` function in JS.

To have varsity watch an element, you need to give that element a unique identifier, as well as add the `data-varsity` attribute. The plugin will use either the value of the `data-varsity` attribute, or else the value of the `id` (if defined) for an element.

```
<div id=example data-varsity></div>

<!-- or -->

<div data-varsity=example></div>
```

Once the plugin is aware of an element to watch, and the unique name of that element, it will make the above values available in the following format: `--name-value`, for example:

- `--example-offsetWidth`
- `--example-offsetHeight`
- `--example-offsetLeft`
- `--example-offsetTop`
- `--example-aspect-rat`io
- `--example-characters`
- `--example-children`
- `--example-value`

- https://github.com/tomhodgins/cssplus

Author: Tommy Hodgins

License: MIT

*/

// Uses Node, AMD or browser globals to create a module
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {

    // AMD: Register as an anonymous module
    define([], factory)

  } else if (typeof module === 'object' && module.exports) {

    // Node: Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node
    module.exports = factory()

  } else {

    // Browser globals (root is window)
    root.varsity = factory()

  }

}(this, function() {

  const varsity = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-varsity-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-varsity-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    // Create new CSS string
    let style = ''

    let tag = null

    // For each [data-varsity] element
    Array.from(document.querySelectorAll('[data-varsity]'), (tag, i) => {

      // Set the name to the value of the data-varsity="" attribute, or the id="" if there is none
      let name = (tag.getAttribute('data-varsity') || tag.id || i)

      // List properties of element as variables
      style += `\n\n  /* ${name} */`
      + `\n  --${name}-offsetWidth: ${tag.offsetWidth};`
      + `\n  --${name}-offsetHeight: ${tag.offsetHeight};`
      + `\n  --${name}-offsetLeft: ${tag.offsetLeft};`
      + `\n  --${name}-offsetTop: ${tag.offsetTop};`
      + `\n  --${name}-aspect-ratio: ${tag.offsetWidth/tag.offsetHeight};`
      + `\n  --${name}-characters: ${(tag.innerHTML.length || tag.value ? tag.value.length : 0 )};`
      + `\n  --${name}-children: ${tag.getElementsByTagName('*').length};`
      + `\n  --${name}-value: ${(tag.value || '')};`
    })

    // Populate style tag with current CSS string
    style_tag.innerHTML = `:root {${style}\n\n}`

  }

  // Update every `load`, `resize`, `input`, and `click`
  window.addEventListener('load', varsity)
  window.addEventListener('resize', varsity)
  window.addEventListener('input', varsity)
  window.addEventListener('click', varsity)

  return varsity

}))
