module.exports = function makeIt(obj) {
  obj[Symbol.iterator] = function*() {
    for(var k in this) {
      if(this.hasOwnProperty(k))
        yield [k, this[k]];
    }
  }

  return obj;
}
