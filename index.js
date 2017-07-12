var print = console.log.bind(console)
var printd = console.dir.bind(console)
var printw = console.warn.bind(console)
var printe = console.error.bind(console)
var tokens = require('./tokens.json')


class FlexLang {
  parse(str) {
    var style = {}
    var reDirection = /^(-?RC|-?CR)(?::(.*)|$)/
    var reDistribution = /(?:([MCA]{1,3})(\[[-~\s]*\]))/g
    var [, direction, distributions = str] = str.match(reDirection) || []
    print(tokens['direction'][direction])

    // m: match, p: prefix, d: distribution, s: stretch
    for(let m, p, d, s; m = reDistribution.exec(distributions);) {
      // Destructure match into prefix and distribution.
      [, p, d] = m
      // Check for stretch mode,
      // replace stretch symbol with normal dist symbol `-`,
      // so we can do a lookup in `tokens`.
      d = d.replace(/~/g, r => (s = true, '-'))

      print(p, tokens['distribution'][d])
    }
  }
}

var fl = new FlexLang()
fl.parse('-RC:M[-- ]CA[ ~~ ]A[ --]')
