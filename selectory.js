/*

# Selectory
## version 0.1.1

Selectory is a CSS reprocessor that resolves selectors using JS. This plugin will read CSS selectors that end with a `[test]` attribute and use JavaScript to determine whether or not to apply that style to elements matching the other part of that selector. For example, the JS test `1 == 1` will always resolve to `true`, so a selector written for `div[test="1 == 1"] {}` will always apply to each `div` element.

By default, Selectory will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run Selectory whenever you want, use the `selectory.load()` function in JS.

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
    root.selectory = factory()

  }

}(this, function() {

  const selectory = {}

  selectory.style = ''
  selectory.count = 0

  selectory.load = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-selectory-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-selectory-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    // Reset plugin styles and element count
    selectory.style = ''
    selectory.count = 0

    // Reset count on [data-selectory] elements in DOM
    Array.from(document.querySelectorAll('[data-selectory]'), tag => {

      tag.setAttribute('data-selectory', '')

    })

    selectory.findRules()

    // Populate style tag with style
    style_tag.innerHTML = `\n${selectory.style}\n`

  }

  selectory.findRules = () => {

    // For each stylesheet
    Array.from(document.styleSheets, sheet => {

      // For each rule
      sheet.cssRules && Array.from(sheet.cssRules, rule => {

        selectory.process(rule)

      })

    })

  }

  selectory.process = rule => {

    // If rule is a qualified rule, process it
    if (rule.type === 1) {

      selectory.style += selectory.transform(rule)

    }

    // If rule is an at-rule, find all qualified rules inside
    if (rule.type === 4) {

      let css_rules = ''

      // Remember media query text
      let mediaText = rule.media.mediaText

      // If there are qualified rules, find all rules
      rule.cssRules && Array.from(rule.cssRules, mediaRule => {

        css_rules += selectory.transform(mediaRule)

      })

      // If there is at least one new rule, wrap in at-rule with media text
      if (css_rules.length > 0) {

        selectory.style += `\n@media ${mediaText} {\n  ${css_rules.replace(/^(.*)$/gmi,'  $1')}\n}\n`

      }

    }

  }

  selectory.transform = rule => {

    let newRule = ''

    let selector = rule.selectorText.replace(/(.*)\s{/gi, '$1')
    let ruleText = rule.cssText.replace(/.*\{(.*)\}/gi, '$1')

    // Start a new list of matching selectors
    let ruleList = []

    let selectorList = selector.split(',')

    // If `[test=` is present anywhere in the selector
    if (selector && selector.indexOf('[test=') !== -1) {

      // Extract the full selector name and test
      selector.replace(/^(.*)\[test=("(?:[^"]*)"|'(?:[^']*)')\].*/i, (string, selectorText, test) => {

        test = test.replace(/^'([^']*)'$/m, '$1')
        test = test.replace(/^"([^"]*)"$/m, '$1')

        // Use asterisk if last character is a space, +, >, or ~
        selectorText = selectorText.replace(/[ \+\>\~]$/m, ' *')

        // Use asterisk (*) if selectorText is an empty string
        selectorText = selectorText === '' ? '*' : selectorText

        // For each tag matching the selector (minus the test)
        Array.from(document.querySelectorAll(selectorText), (tag, i) => {

          // Create a new function with our test
          const func = new Function(`return (${test})`)

          // Run the test with our matching element
          if (func.call(tag)) {

            // Increment the plugin element count
            selectory.count++

            // Create a new selector for our new CSS rule
            let newSelector = selector.replace(/^(.*\[)(test=(?:"[^"]*"|'[^']*'))(\].*)$/mi, (string, before, test, after) => {
              console.log(after)
              return `${before}data-selectory~="${selectory.count}"${after}`

            })

            // Mark matching element with attribute and plugin element count
            let currentAttr = tag.getAttribute('data-selectory')
            tag.setAttribute('data-selectory', `${currentAttr} ${selectory.count}`)

            // And add our new attribute to the selector list for that rule
            ruleList.push(newSelector)

          }

        })

      })

    }

    // If at least one element passed the test
    if (ruleList.length > 0) {

        newRule =  `\n/* ${selector} */\n${ruleList} {\n   ${ruleText.replace(/(; )([^\{])/g,';\n  $2')}\n}\n`

    }

    return newRule

  }

  // Update every `load`, `resize`, `input`, and `click`
  window.addEventListener('load', selectory.load)
  window.addEventListener('resize', selectory.load)
  window.addEventListener('input', selectory.load)
  window.addEventListener('click', selectory.load)

  return selectory

}))
