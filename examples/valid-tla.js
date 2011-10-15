
var a = require('../')

//assert that bar has a property letters: 3, and a name, which is a string.
var validTLA = a._has({
  letters: 3,
  name: a._isString('make it a string!')
}, 'must be a real Three Letter Acronym')

a.every([
  {name: 'WTF', letters: 3},
  {name: 'TLA', letters: 3},
  {name: 'IMHO', letters: 4}
], validTLA)
