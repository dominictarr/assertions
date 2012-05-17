
var _deepEqual = require('./deep-equal')._deepEqual //pulled from node
  , fail = require('./failure').fail
//elementary assertions.

module.exports = {

  equal: function (actual, expected, message) {

    if(!(actual == expected))
      throw fail(new Error()).simple('equal', actual, expected, '==', message)

  },

  notEqual: function (actual, expected, message) {

    if(actual == expected)
      throw fail(new Error()).simple('notEqual', actual, expected, '!=', message)

  },

  strictEqual: function (actual, expected, message) {

    if(!(actual === expected))
      throw fail(new Error()).simple('strictEqual', actual, expected, '===', message)

  },
  
  notStrictEqual: function (actual, expected, message) {

    if(actual === expected)
      throw fail(new Error()).simple('notStrictEqual', actual, expected, '!==', message)

  },

  ok: function (actual, message) {    

    if(!(!!actual))
      throw fail(new Error()).explain('ok: {actual:render} must be truthy', {actual: actual}, message)  

  },

  deepEqual: function (actual, expected, message) {

    if(!_deepEqual(actual, expected))
      throw (
        fail(new Error())
          .explain('deepEqual: {actual:render} must deepEqual {expected:render}'
          , {actual: actual, expected: expected}, message)  
      )
  },

  notDeepEqual: function (actual, expected, message) {

    if(_deepEqual(actual, expected))
      throw (
        fail(new Error())
          .explain('deepEqual: {actual:render} must not deepEqual {expected:render}'
          , {actual: actual, expected: expected}, message)  
      )
  }

}

exports['ifError'] = exports.ok
