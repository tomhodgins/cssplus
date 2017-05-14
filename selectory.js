
/*

# Selectory
## version 0.0.6

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

  let style = ''

  const selectory = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-selectory-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-selectory-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    style = ''

    findRules()

    // Populate style tag with style
    style_tag.innerHTML = `\n${style}\n`

  }

  const findRules = () => {

    // For each stylesheet
    Array.from(document.styleSheets, sheet => {

      // For each rule
      sheet.cssRules && Array.from(sheet.cssRules, rule => {

        process(rule)

      })

    })

  }

  const process = rule => {

    // If global rule
    if (rule.type === 1) {

      newRule = transform(rule)

      if (newRule.length > 0) {

        style += `${newRule}\n`

      }

    }

    // If rule is a media query, loop through to find all rules
    if (rule.type === 4) {

      let css_rules = ''

      // Remember media query text
      let mediaText = rule.media.mediaText

      // If there are rules, find all rules
      rule.cssRules && Array.from(rule.cssRules, mediaRule => {

        css_rules += transform(mediaRule)

      })

      // Add all rules from media query to css

      if (css_rules.length > 0) {

        style += `  @media ${mediaText} {\n${css_rules.replace(/^(.*)$/gmi,'  $1')}\n  }\n`

      }

    }

  }

  const transform = rule => {

    let selector = rule.selectorText.replace(/(.*)\s{/gi, '$1')
    let ruleText = rule.cssText.replace(/.*\{(.*)\}/gi, '$1')

    // Start a new list of matching selectors
    let selectorList = ''

    // Create a new attribute for elements that match this
    let attr = ''

    // If `[test=` is present anywhere in the selector
    if (selector && selector.indexOf('[test=') !== -1) {

      // Extract the full selector name and test
      selector.replace(/^(.*)\[test=(?:"(.*)"|'(.*)')\]/i, (string, selectorText, test) => {

        // Use asterisk (*) if selectorText is an empty string
        selectorText = selectorText === '' ? '*' : selectorText

        // For each tag matching the selector (minus the test)
        Array.from(document.querySelectorAll(selectorText), (tag, i) => {

          // Create a new function with our test
          const func = new Function(`return (${test})`)

          // Run the test with our matching element
          if (func.call(tag)) {

            attr = 'data-' + selectorText.replace(/[\#\.\[\]\=\"\'\^\*\$\:\s]/g,'-')

            var newSelector = selector.replace(/^(.*\[)(test=(?:".*"|'.*'))(\])/i, (string, before, test, after) => {

              return before + attr + '="' + i + '"' + after

            })

            // If true, add a new attribute to our element
            tag.setAttribute(attr, i)

            // And add our new attribute to the selector list for that rule
            const comma = selectorList.length == 0 ? '' : ',\n  '
            selectorList += comma + newSelector

          }

        })

      })

    }

    // If at least one element passed the test
    if (0 < selectorList.length) {

        return `\n  /* ${attr} */\n  ${selectorList} {\n   ${ruleText.replace(/(; )([^\{])/g,';\n    $2')}\n  }\n`

    } else {

      return ''

    }

  }

  // Update every `load`, `resize`, `input`, and `click`
  window.addEventListener('load', selectory)
  window.addEventListener('resize', selectory)
  window.addEventListener('input', selectory)
  window.addEventListener('click', selectory)

  return selectory

}))
