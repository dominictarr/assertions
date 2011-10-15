

var extended    = require('./extended')
  , elementary  = require('./elementary')
  , higher      = require('./higher')

function mixin (obj) {
  for(var key in obj) {
    exports[key] = obj[key]
  }
}

function curry (obj) {
  for(var key in obj)
    (function (key) {
      exports['_'+key] = function curried () {
        var args = [].slice.call(arguments)
        var curried = function (head) {
          obj[key].apply(this, [head].concat(args))
        }
        curried._name = key
        return curried
      }
    })(key)
}

mixin(elementary)
mixin(extended)
mixin(higher)

curry(elementary)
curry(extended)
curry(higher)
