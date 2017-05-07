
/*
 * Scrollery
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

      if (tag.getAttribute('data-scrollery-listen') !== true) {

        if (tag === document.documentElement || tag === document.body) {

          window.addEventListener('scroll', scrollery)

        } else {

          tag.addEventListener('scroll', scrollery)

        }

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

      // List properties of element as variables
      style += `\n\n  /* ${name} */`
      + `\n  --${name}-scrollWidth: ${tag.scrollWidth};`
      + `\n  --${name}-scrollHeight: ${tag.scrollHeight};`
      + `\n  --${name}-scrollLeft: ${tag.scrollLeft};`
      + `\n  --${name}-scrollTop: ${tag.scrollTop};`
    })

    // Populate style tag with current CSS string
    style_tag.innerHTML = `:root {${style}\n\n}`

  }

  // Update every `scroll`
  window.addEventListener('load', scrollery)

  return scrollery

}))
