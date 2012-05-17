//asserters

var fail = require('./failure').fail
  , elementary = require('./elementary')

exports = module.exports = {
  isTypeof: function (actual, expected, message){
    if(expected !== typeof actual)
      throw fail(new Error()).simple('isTypeOf', actual, expected, 'typeof', message)
  }
, isInstanceof: function (actual,expected,message){
    if(!(actual instanceof expected))
      throw fail(new Error()).simple('isInstanceof', actual, expected, 'instanceof', message)
  }
, isArray: function (actual, message) {
    if(!Array.isArray(actual))
      throw fail(new Error()).explain('isArray: Array.isArray({actual:render})', {actual: actual}, message)
  }
, primitive: function (actual,message){
    if(!('function' !== typeof actual && 'object' !== typeof actual ))
      throw fail(new Error()).explain('primitive: {actual:render} must not be a function or an object', {actual: actual}, message)
  }
, complex: function (actual,message){
    if(!('function' == typeof actual || 'object' == typeof actual ))
      throw fail(new Error()).explain('complex: {actual:render} must be a function or an object', {actual: actual}, message)
  }
, isFunction: function (actual, message){
    if(!('function' == typeof actual))
      throw fail(new Error()).explain('isFunction: "function" == typeof {actual:render}', {actual: actual}, message)
  }
, matches : function (input, pattern, message) {
    if(!pattern.test(input))
      throw fail(new Error()).simple('matches', input, pattern, 'must match', message)
  }
, like: function (actual, expected, respect, message) {
    respect = respect || {} 
    var op = 'like({' +
      [ respect.case ? 'case: true' : '' 
      , respect.whitespace ? 'whitespace: true' : '' 
      , respect.quotes ? 'quotes: true' : '' 
      ].join() 
      + '})'
      
    var a = '' + actual, e = '' + expected
    
    if(!respect.case) {
      a = a.toLowerCase()
      e = e.toLowerCase()
    }
    if(!respect.whitespace) {
      a = a.replace(/\s/g,'')
      e = e.replace(/\s/g,'')
    }
    if(!respect.quotes) {
      a = a.replace(/\"|\'/g,'\"')
      e = e.replace(/\"|\'/g,'\"')
    }

    if(! (a == e))
      throw fail(new Error()).simple('like', a, e, 'must be like', message)
  }
, lessThan: function (actual, expected, message) {
    if(!(actual < expected))
      throw fail(new Error()).simple('lessThan', actual, expected, '<', message)
  }
, greaterThan: function (actual, expected, message) {
    if(!(actual > expected))
      throw fail(new Error()).simple('greaterThan', actual, expected, '>', message)
  }
, lessThanOrEqual: function (actual, expected, message) {
    if(!(actual <= expected))
      throw fail(new Error()).simple('lessThanOrEqual', actual, expected, '<=', message)
  }
, greaterThanOrEqual: function (actual,expected, message) {
    if(!(actual >= expected))
      throw fail(new Error()).simple('greaterThanOrEqual', actual, expected, '>=', message)
  }
, between: function (actual, hi, lo, message) {
    if (lo > hi) {
      var tmp = hi; hi = lo; lo = tmp;
    }
    if(!(actual > lo && actual < hi))
      throw fail(new Error()).explain('between:{min} < {actual} < {max}', {actual: actual, min: lo, max: hi}, message)
  }
, betweenOrEqual: function (actual, hi, lo, message) {
    if (lo > hi) {
      var tmp = hi; hi = lo; lo = tmp;
    }
    if(!(actual >= lo && actual <= hi))
      throw fail(new Error()).explain('betweenOrEqual:{min} <= {actual} <= {max}', {actual: actual, min: lo, max: hi}, message)
  }
, isValidDate: function (actual, message) {
    var parsed = new Date(actual)
    if('Invalid Date' == parsed)
      throw fail(new Error()).explain('isValidDate:{actual} must be valid date', {actual: actual, min: lo, max: hi}, message)
  }
, contains: function (actual, expected, message) {
    var i = actual.indexOf(expected)
    if(-1 === i)
      throw fail(new Error()).simple('contains', actual, expected, 'contains', message)
  }
, includes: function (actual, expected, message) {
    var i = expected.indexOf(actual)
    if(-1 === i)
      throw fail(new Error()).simple('includes', actual, expected, 'includes', message)
  }
, isString: function (actual, message) {
    exports.isTypeof(actual, 'string', message)
  }
, isNumber: function (actual, message) {
    exports.isTypeof(actual, 'number', message)
  }
, isBoolean: function (actual, message) {
    exports.isTypeof(actual, 'boolean', message)
  }
, isUndefined: function (actual, message) {
    exports.isTypeof(actual, 'undefined', message)
  }
, isNull: function (actual, message) {
    elementary.strictEqual(actual, null, message)
  }
, isEmpty: function (actual, message) {
    elementary.deepEqual(actual, [], message)
  }
}

exports['typeof'] = exports.isTypeof

