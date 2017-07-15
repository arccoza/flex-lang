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
    this.reMap2 = [
      ['direction', /(-?H|-?V)(?:,\s*)|$/],
      ['wrapping', /([<>][/\s]?[<>])(?:,\s*)|$/],
      ['distribution', /(?:([JAS]{1,3})(\[[-~\s]*\]))/g],
    ]
  }

  layout(str) {
    var format = this.format
    var style = {}
    var childStyle = {}

    for (let [nm, re] of this.reMap2) {
      for (let m of hunt(re, str)) {
        switch (nm) {
          case 'direction':
          case 'wrapping':
            var [, t] = m
            style[tokens['property'][format][nm]] = tokens[nm][t]
            break
          case 'distribution':
            var [, p, t] = m
            var v = tokens[nm][t]
            for (let k of [...p])
              style[tokens['property'][format][k]] = v
            break
        }
      }
    }

    return [style, childStyle]
  }

  orient(str) {
    // ~(1 0 0), #2, [ -- ]
  }
}

var fl = new FlexLang({format: 'css'})
print(...fl.layout('-H, >>, J[-- ], JAS[ -  - ]'))
