

var extended  = require('./extended')
  , assert    = require('assert')
  , higher    = require('./higher')

function mixin (obj) {
  for(var key in obj) {
    exports[key] = obj[key]
  }
}

mixin(assert)
mixin(extended)
mixin(higher)