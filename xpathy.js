/*

# XPathy
## version 0.0.12

XPathy is a CSS reprocessor that resolves selectors using XPath. This plugin will read CSS selectors that end with a `[xpath]` attribute and use JavaScript and XPath to determine whether or not to apply that style to elements matching the other part of that selector. For example, the XPath selector `//div` will always resolve to `div`, so a selector written for `div [xpath="//div"] {}` will always apply to each `div div {}` element.

By default, XPathy will reprocess selectors by watching the following events:

- `load`
- `resize`
- `input`
- `click`

To run XPathy whenever you want, use the `xpathy.load()` function in JS.

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
    root.xpathy = factory()

  }

}(this, function() {

  const xpathy = {}

  xpathy.style = ''
  xpathy.count = 0

  xpathy.load = () => {

    // Find (or create) style tag to populate
    const style_tag = document.querySelector('[data-xpathy-style]') || (() => {

      const tag = document.createElement('style')
      tag.setAttribute('data-xpathy-style', '')
      document.head.appendChild(tag)
      return tag

    })()

    // Reset plugin styles and element count
    xpathy.style = ''
    xpathy.count = 0

    // Reset count on [data-xpathy] elements in DOM
    Array.from(document.querySelectorAll('[data-xpathy]'), tag => {

      tag.setAttribute('data-xpathy', '')

    })

    xpathy.findRules()

    // Populate style tag with style
    style_tag.innerHTML = `\n${xpathy.style}\n`

  }

  xpathy.findRules = () => {

    // For each stylesheet
    Array.from(document.styleSheets, sheet => {

      // For each rule
      sheet.cssRules && Array.from(sheet.cssRules, rule => {

        xpathy.process(rule)

      })

    })

  }

  xpathy.process = rule => {

    // If rule is a qualified rule, process it
    if (rule.type === 1) {

      xpathy.style += xpathy.transform(rule)

    }

    // If rule is an at-rule, find all qualified rules inside
    if (rule.type === 4) {

      let css_rules = ''

      // Remember media query text
      let mediaText = rule.media.mediaText

      // If there are qualified rules, find all rules
      rule.cssRules && Array.from(rule.cssRules, mediaRule => {

        css_rules += xpathy.transform(mediaRule)

      })

      // If there is at least one new rule, wrap in at-rule with media text
      if (css_rules.length > 0) {

        xpathy.style += `\n@media ${mediaText} {\n  ${css_rules.replace(/^(.*)$/gmi,'  $1')}\n}\n`

      }

    }

  }

  xpathy.transform = rule => {

    let newRule = ''

    let selector = rule.selectorText.replace(/\s*([^{]+)\s*{/gi, '$1')
    let ruleText = rule.cssText.replace(/[^{]+\{([^}]*)\}/gi, '$1')

    // Start a new list of matching rules
    let ruleList = []

    // If `[xpath=` is present anywhere in the selector
    if (selector && selector.indexOf('[xpath=') !== -1) {

      // Extract the full selector name and test
      selector.replace(/^(.*)\[xpath=("(?:[^"]+)"|'(?:[^']+)')\].*/i, (string, selectorText, xpath) => {

        xpath = xpath.replace(/^'([^']*)'$/m, '$1')
        xpath = xpath.replace(/^"([^"]*)"$/m, '$1')

        // Create new array to hold nodes selected by XPath
        let list = new Array()

        // use document.evaluate() to query DOM with our XPath
        let nodes = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        )

        // If at least one node matches our XPath
        if (nodes) {

          for (let i=0; i<nodes.snapshotLength; i++) {

            // Add each element to our list
            list.push(nodes.snapshotItem(i))

          }

        }

        // If our list contains at least one node
        if (list.length > 0) {

          // For each tag matching the selector
          list.forEach((tag, i) => {

            // Increment the plugin element count
            xpathy.count++

            // Create a new selector for our new CSS rule
            let newSelector = selector.replace(/^(.*\[)(xpath=(?:"[^"]*"|'[^']*'))(\].*)$/im, (string, before, test, after) => {

              return `${before}data-xpathy~="${xpathy.count}"${after}`

            })

            // Mark matching element with attribute and plugin element count
            let currentAttr = tag.getAttribute('data-xpathy')
            tag.setAttribute('data-xpathy', `${currentAttr} ${xpathy.count}`)

            // And add our new attribute to the selector list for that rule
            ruleList.push(newSelector)

          })

        }

      })

      // If at least one element passed the test
      if (ruleList.length > 0) {

          newRule =  `\n/* ${selector} */\n${ruleList} {\n   ${ruleText.replace(/(; )([^\{])/g,';\n  $2')}\n}\n`

      }

    }

    return newRule

  }

  // Update every `load`, `resize`, `input`, and `click`
  window.addEventListener('load', xpathy.load)
  window.addEventListener('resize', xpathy.load)
  window.addEventListener('input', xpathy.load)
  window.addEventListener('click', xpathy.load)

  return xpathy

}))
