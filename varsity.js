
/*
 * Varsity
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
      + `\n  --${name}-scrollWidth: ${tag.scrollWidth};`
      + `\n  --${name}-scrollHeight: ${tag.scrollHeight};`
      + `\n  --${name}-scrollLeft: ${tag.scrollLeft};`
      + `\n  --${name}-scrollTop: ${tag.scrollTop};`
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
