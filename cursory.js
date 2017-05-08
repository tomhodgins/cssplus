
/*

# Cursory
## version 0.0.3

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

  const cursory = (e) => {

    // Find current cursor position
    document.documentElement.style.setProperty('--cursorX', e.clientX || (e.touches ? e.touches[0].clientX : innerWidth/2))
    document.documentElement.style.setProperty('--cursorY', e.clientY || ( e.touches ? e.touches[0].clientY : innerHeight/2))
    document.documentElement.style.setProperty('--innerWidth', innerWidth)
    document.documentElement.style.setProperty('--innerHeight', innerHeight)
    document.documentElement.style.setProperty('--clicked', clicked)

  }

  // Set status of `clicked` variable
  let clicked = 0

  const startClick = (e) => {
    clicked = 1
    cursory(e)
  }

  const endClick = (e) => {
    clicked = 0
    cursory(e)
  }

  // Update on `load`
  window.addEventListener('load', cursory)

  // Update every `mousemove`, `touchstart, and `touchmove`
  window.addEventListener('mousemove', cursory)
  window.addEventListener('touchmove', cursory)

  // Start click on `mousedown` and `touchstart`
  window.addEventListener('mousedown', startClick)
  window.addEventListener('touchstart', startClick)

  // End click on `mouseup` and `touchend`
  window.addEventListener('mouseup', endClick)
  window.addEventListener('touchend', endClick)

  return cursory

}))
