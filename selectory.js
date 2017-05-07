
/*

# Selectory
## version 0.0.1

Selectory is a CSS reprocessor that resolves selectors using JS. This plugin will read CSS selectors that end with a `[test]` attribute and use JavaScript to determine whether or not to apply that style to elements matching the other part of that selector. For example, the JS test `1 == 1` will always resolve to `true`, so a selector written for `div[test="1 == 1"] {}` will always apply to each `div` element.

By default, Selectory will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run Selectory whenever you want, use the `selectory()` function in JS.

- https://github.com/tomhodgins/cssplus

Author: Tommy Hodgins

License: MIT

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
    root.selectory = factory();

  }

}(this, function() {

  const selectory = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-selectory-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-selectory-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    let style = ''

    // For each stylesheet
    Array.from(document.styleSheets, sheet => {

      // For each rule
      Array.from(sheet.cssRules, rule => {

        // Remember selector and rule text
        let selector = rule.selectorText
        let ruleText = rule.cssText

        // Start a new list of matching selectors
        let selectorList = ''

        // Extract css styles from rule
        ruleText = ruleText.replace(/.*\{(.*)\}/,(string,match)=>{return match})

        // If `[test=` is present anywhere in the selector
        if (selector.indexOf('[test=') !== -1) {

          // Extract the full selector name and test
          selector = selector.replace(/^(.*)\[test=(?:"(.*)"|'(.*)')\]/gi, (string, selectorText, test) => {

            // Use asterisk (*) if selectorText is an empty string
            selectorText = selectorText === '' ? '*' : selectorText

            // For each tag matching the selector (minus the test)
            Array.from(document.querySelectorAll(selectorText), (tag, i) => {

              // Create a new function with our test
              const func = new Function(`return (${test})`)

              // Run the test with our matching element
              if (func.call(tag)) {

                let attr = 'data-' + selectorText.replace(/[\#\.\[\]\=\"\'\^\*\$\:\s]/g,'-')

                // If true, add a new attribute to our element
                tag.setAttribute(attr, i)

                // And add our new attribute to the selector list for that rule
                const comma = selectorList.length == 0 ? '' : ','
                selectorList += `${comma} [${attr}="${i}"]`

              }

            })

          })

        }

        // If at least one element passed the test
        if (0 < selectorList.length) {

          // Populate style tag with matching rules
          style += `${selectorList} { ${ruleText} }`

        }

      })

    })

    // Populate style tag with style
    style_tag.innerHTML = style

  }

  // Update every `load`, `resize`, `input`, and `click`
  window.addEventListener('load', selectory)
  window.addEventListener('resize', selectory)
  window.addEventListener('input', selectory)
  window.addEventListener('click', selectory)

  return selectory

}))
