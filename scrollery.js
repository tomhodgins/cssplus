
/*

# Scrollery
## version 0.0.6

Scrollery is a CSS reprocessor that makes the following JS values available as CSS variables for any element you tell the plugin to watch:

- `scrollWidth`
- `scrollHeight`
- `scrollLeft`
- `scrollTop`

To have scrollery watch an element, you need to give that element a unique identifier, as well as add the `data-scrollery` attribute. The plugin will use either the value of the `data-scrollery` attribute, or else the value of the `id` (if defined) for an element.

By default, Scrollery will watch 0 elements. If you add a `data-scrollery` attribute to either the `<html>` or `<body>` element it will attach an event listener for the `scroll` event on the `window`, otherwise if you add the `data-scrollery` attribute to other elements it will add a `scroll` listener to that element.

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
    root.scrollery = factory()

  }

}(this, function() {

  const scrollery = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-scrollery-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-scrollery-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    // Add scroll event listeners on elements with [data-scrollery] attribute
    Array.from(document.querySelectorAll('[data-scrollery]'), tag => {

      // If we haven't added an event listener yet
      if (tag.getAttribute('data-scrollery-listen') !== true) {

        // If listening to <html> or <body>
        if (tag === document.documentElement || tag === document.body) {

          // watch `scroll` on `window`
          window.addEventListener('scroll', scrollery)

        } else {

          // Otherwise listen to the `scroll` event on the element
          tag.addEventListener('scroll', scrollery)

        }

        // Mark that we've added an event listener here
        tag.setAttribute('data-scrollery-listen', 'true')

      }

    })

    // Create new CSS string
    let style = ''

    let tag = null

    // For each [data-varsity] element
    Array.from(document.querySelectorAll('[data-scrollery]'), (tag, i) => {

      // Set the name to the value of the data-varsity="" attribute, or the id="" if there is none
      let name = (tag.getAttribute('data-scrollery') || tag.id || i)

      // Find current scrollHeight
      let origHeight = tag.style.height
      tag.style.height = 'auto'
      let newScrollHeight = tag.scrollHeight
      tag.style.height = origHeight

      // Find current scrollWidth
      let origWidth = tag.style.width
      tag.style.width = 'auto'
      let newScrollWidth = tag.scrollWidth
      tag.style.width = origWidth

      // List properties of element as variables
      style += `\n\n  /* ${name} */`
      + `\n  --${name}-scrollWidth: ${newScrollWidth};`
      + `\n  --${name}-scrollHeight: ${newScrollHeight};`
      + `\n  --${name}-scrollLeft: ${tag.scrollLeft};`
      + `\n  --${name}-scrollTop: ${tag.scrollTop};`
    })

    // Populate style tag with current CSS string
    style_tag.innerHTML = `:root {${style}\n\n}`

  }

  // Update every `load`
  window.addEventListener('load', scrollery)
  window.addEventListener('resize', scrollery)

  return scrollery

}))
