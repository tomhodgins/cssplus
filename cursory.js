
/*
 * Cursory
 */

// Uses Node, AMD or browser globals to create a module
(function (root, factory) {

  if (typeof define === 'function' && define.amd) {

    // AMD: Register as an anonymous module
    define([], factory);

  } else if (typeof module === 'object' && module.exports) {

    // Node: Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node
    module.exports = factory();

  } else {

    // Browser globals (root is window)
    root.EQCSS = factory();

  }

}(this, function(e) {

  const cursory = (e) => {

    // Find current cursor position
    document.documentElement.style.setProperty('--cursorX', e.clientX || e.touches[0].clientX || innerWidth/2)
    document.documentElement.style.setProperty('--cursorY', e.clientY || e.touches[0].clientY || innerHeight/2)
    document.documentElement.style.setProperty('--innerWidth', innerWidth)
    document.documentElement.style.setProperty('--innerHeight', innerHeight)
    document.documentElement.style.setProperty('--clicked', (clicked ? 1 : 0))

  }

  let clicked = false

  const startClick = (e) => {
    clicked = true
    cursory(e)
  }

  const endClick = (e) => {
    clicked = false
    cursory(e)
  }

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
