var print = console.log.bind(console)
var printd = console.dir.bind(console)
var printw = console.warn.bind(console)
var printe = console.error.bind(console)
var tokens = require('./tokens.json')


class FlexLang {
  constructor({format = 'js'} = {}) {
    this.format = format
  }

  layout(str) {
    var format = this.format
    var style = {}
    var childStyle = {}
    var reDirection = /^(-?RC|-?CR)(?::(.*)|$)/
    var reDistribution = /(?:([MCA]{1,3})(\[[-~\s]*\]))/g
    var [, direction, distributions = str] = str.match(reDirection) || []
    // print(tokens['direction'][direction])
    style[tokens['property'][format]['direction']] = tokens['direction'][direction]

    // m: match, p: properties, d: distribution, s: stretch
    for (let m, p, d, s; m = reDistribution.exec(distributions);) {
      // Destructure match into properties and distribution.
      [, p, d] = m
      // Check for stretch mode,
      // replace stretch symbol with normal dist symbol `-`,
      // so we can do a lookup in `tokens`.
      d = d.replace(/~/g, r => (s = true, '-'))

      print(p, d)
      let val = null
      for (let k of [...p]) {
        print(k)
        let prop = tokens['property'][format][k]
        // let val = null

        print(val)
        if (k != 'A')
          val = val || tokens['distribution'][d]
        else
          val = tokens['alignment'][d]

        if (s && (k != 'A')) {
          if (k == 'C')
            style[prop] = 'stretch'
          else {
            style[prop] = val
            childStyle['flex'] = '1'
          }
        }
        else
          style[prop] = val

        print(prop, val)
      }
    }

    return [style, childStyle]
  }
}

var fl = new FlexLang({format: 'css'})
print(...fl.layout('-RC:M[-- ]MCA[ ~ ~ ]'))
