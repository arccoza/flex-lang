"use strict"
var print = console.log.bind(console)
var printd = console.dir.bind(console)
var printw = console.warn.bind(console)
var printe = console.error.bind(console)
var tokens = require('./tokens.json')


function* hunt(re, str) {
  re.lastIndex = 0
  if (!re.global)
    yield re.exec(str)
  else
    for (let m; m = re.exec(str);) {
      re.lastIndex = m.index === re.lastIndex ? re.lastIndex + 1 : re.lastIndex
      yield m
    }
}

class FlexLang {
  constructor({format = 'js'} = {}) {
    this.format = format
    this.reLayout = [
      ['direction', /(-?H|-?V)(?:,\s*)|$/],
      ['wrapping', /([<>][/\s]?[<>])(?:,\s*)|$/],
      ['distribution', /(?:([JAS]{1,3})(\[[-~\s]*\]))/g],
    ]
    this.reOrient = [
      ['flexibility', /~\((.*)\)(?:(?:,\s*)|$)/],
      ['ordering', /\#(\d*)(?:(?:,\s*)|$)/],
      ['distribution', /(?:([JA]{0,2})(\[[-~\s]*\]))/g],
    ]
  }

  layout(str) {
    var format = this.format
    var style = {}
    var childStyle = {}

    for (let [nm, re] of this.reLayout) {
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
    var format = this.format
    var style = {}

    for (let [nm, re] of this.reOrient) {
      for (let m of hunt(re, str)) {
        switch (nm) {
          case 'flexibility':
            var [, v] = m
            style[tokens['property'][format]['orient'][nm]] = v
            break
          case 'ordering':
            var [, v] = m
            style[tokens['property'][format]['orient'][nm]] = v
            break
          case 'distribution':
            var [, p, t] = m
            p = p ? p : 'A'  // `align-self` is the default if no prefix provided.
            var v = tokens[nm][t]
            for (let k of [...p])
              style[tokens['property'][format]['orient'][k]] = v
            break
        }
      }
    }

    return style
  }
}

var fl = new FlexLang({format: 'css'})
// print(...fl.layout('-H, >>, J[-- ], JAS[ -  - ]'))
print(fl.orient('~(1 0 0), #2, [ -  - ]'))
