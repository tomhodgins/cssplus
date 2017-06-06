
/*

# Cursory
## version 0.0.9

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

In addition, the `--clicked` variable is changed from `0` to `1` between the `mousedown` and `touchstart` events and the corresponding `mouseup` or `touchend` events.

To run Cursory whenever you want, use the `cursory()` function in JS.

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
    root.cursory = factory()

  }

}(this, function(e) {

  const cursory = {}

  cursory.style = ''

  cursory.load = (e) => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-cursory-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-cursory-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    cursory.style = ''

    cursory.process(e)

    // Populate style tag with current CSS string
    style_tag.innerHTML = `:root {\n${cursory.style.replace(/^/gm,'  ')}\n}`

  }

  cursory.process = e => {

    let newRule = cursory.transform(e)

    if (newRule.length > 0) {

      cursory.style = newRule

    }

  }

  cursory.transform = e => {

    let newRule = ''

    // List cursor position, window dimensions, and click status
    newRule += `\n--cursorX: ${e.clientX || (e.touches ? e.touches[0].clientX : innerWidth/2)};`
    + `\n--cursorY: ${e.clientY || ( e.touches ? e.touches[0].clientY : innerHeight/2)};`
    + `\n--innerWidth: ${innerWidth};`
    + `\n--innerHeight: ${innerHeight};`
    + `\n--clicked: ${cursory.clicked};`
    + '\n'

    return newRule

  }

  // Set status of `clicked` variable
  cursory.clicked = 0

  cursory.startClick = e => {
    cursory.clicked = 1
    cursory.load(e)
  }

  cursory.endClick = e => {
    cursory.clicked = 0
    cursory.load(e)
  }

  // Update on `load` and `resize`
  window.addEventListener('load', cursory.load)
  window.addEventListener('resize', cursory.load)

  // Update every `mousemove` and `touchmove`
  window.addEventListener('mousemove', cursory.load)
  window.addEventListener('touchmove', cursory.load)

  // Start click on `mousedown` and `touchstart`
  window.addEventListener('mousedown', cursory.startClick)
  window.addEventListener('touchstart', cursory.startClick)

  // End click on `mouseup` and `touchend`
  window.addEventListener('mouseup', cursory.endClick)
  window.addEventListener('touchend', cursory.endClick)

  return cursory

}))
