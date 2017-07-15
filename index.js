"use strict"
var print = console.log.bind(console)
var printd = console.dir.bind(console)
var printw = console.warn.bind(console)
var printe = console.error.bind(console)
var tokens = require('./tokens.json')


function* hunt(re, str) {
  if (!re.global)
    yield re.exec(str)
  else
    for (let m; m = re.exec(str);) yield m
}

class FlexLang {
  constructor({format = 'js'} = {}) {
    this.format = format
    this.reMap = [
      [/(-?H|-?V)(?:,\s*)|$/, function*([, m]) {
        yield [tokens['property'][format]['direction'], tokens['direction'][m]]
      }],

      [/([<>/\s]{2,3})(?:,\s*)|$/, function*([, m]) {
        yield [tokens['property'][format]['wrapping'], tokens['wrapping'][m]]
      }],

      [/(?:([JAS]{1,3})(\[[-~\s]*\]))/g, function*([, p, d]) {
        let v = tokens['distribution'][d]
        for (let k of [...p]) {
          yield [tokens['property'][format][k], v]
        }
      }],
    ]
  }

  layout(str) {
    var format = this.format
    var style = {}
    var childStyle = {}
    var reDirection = /(-?H|-?V)(?:,\s*)|$/
    var reWrapping = /([<>/\s]{2,3})(?:,\s*)|$/
    var reDistribution = /(?:([JAS]{1,3})(\[[-~\s]*\]))/g
    var direction, wrapping, distributions

    // distributions = str
    //   .replace(reDirection, (r, t) => (print(r), direction = t, ''))
    //   .replace(reWrapping, (r, t) => (print(r), wrapping = t, ''))

    for (let [re, fn] of this.reMap) {
      for (let m of hunt(re, str)) {
        for (let [k, v] of fn(m))
          style[k] = v
          // print(k, v)
        // let [k, v] = fn(m)
        // style[k] = v
        // print(fn(m))
      }
    }

    // if (direction)
    //   style[tokens['property'][format]['direction']] = tokens['direction'][direction]
    // if (wrapping)
    //   style[tokens['property'][format]['wrapping']] = tokens['wrapping'][wrapping]

    // // m: match, p: properties, d: distribution, s: stretch
    // for (let m, p, d, s; m = reDistribution.exec(distributions);) {
    //   // Destructure match into properties and distribution.
    //   [, p, d] = m
    //   // Check for stretch mode,
    //   // replace stretch symbol with normal dist symbol `-`,
    //   // so we can do a lookup in `tokens`.
    //   d = d.replace(/~/g, r => (s = true, '-'))

    //   print(p, d)
    //   let val = null
    //   for (let k of [...p]) {
    //     print(k)
    //     let prop = tokens['property'][format][k]
    //     // let val = null

    //     print(val)
    //     if (k != 'A')
    //       val = val || tokens['distribution'][d]
    //     else
    //       val = tokens['alignment'][d]

    //     if (s && (k != 'A')) {
    //       if (k == 'C')
    //         style[prop] = 'stretch'
    //       else {
    //         style[prop] = val
    //         childStyle['flex'] = '1'
    //       }
    //     }
    //     else
    //       style[prop] = val

    //     print(prop, val)
    //   }
    // }

    return [style, childStyle]
  }

  orient(str) {
    // ~(1 0 0), #2, [ -- ]
  }
}

var fl = new FlexLang({format: 'css'})
print(...fl.layout('-H, </>, J[-- ], JAS[ -  - ]'))
