//asserters

var assert = require('assert')

exports = module.exports = {
  isTypeof: function (actual,expected,message){
    if(expected !== typeof actual)
      assert.fail(actual, expected, (actual + ' typeof ' + expected),'typeof',arguments.callee)
  }
, isInstanceof: function (actual,expected,message){
    if(!(actual instanceof expected))
      assert.fail(actual,expected, message,'instanceof',arguments.callee)
  }
, isArray: function (actual, message) {
    if(!Array.isArray(actual))
      assert.fail(actual, [], message, 'isArray', arguments.callee)
  }
, primitive: function (actual,message){
    if('function' == typeof actual || 'object' == typeof actual) 
      assert.fail(actual, 'must be number, string, boolean, or undefined'
        , message,'primitive',arguments.callee)
  }
, complex: function (actual,message){
    if('function' !== typeof actual && 'object' !== typeof actual) 
      assert.fail(actual,'must be object or function' 
        , message,'complex',arguments.callee)
  }
, isFunction: function (actual,message){
    if('function' !== typeof actual) 
      assert.fail('function',actual 
        , message,'should be a',arguments.callee)
  }
, property: function (actual,property,value,message){
    if(!actual[property] && value == null)
    //checks that property is defined on actual, even if it is undefined (but not deleted)
      assert.fail(actual , property
        , message,'must have property',arguments.callee)
    //if value is a function, assume it is an assertion... apply it to actual[property]
    if('function' == typeof value)
      value(actual[property])
    else if (value != null) //else if value is exiting, check it's equal to actual[property]
      exports.equal(actual[property],value, message) 
      
    //if you want to assert a value is null or undefined,
    //use .property(name,it.equal(null|undefined))
  }
, matches : function (input,pattern,message) {
    if(!pattern(input))
      assert.fail(input, pattern
      , (message || '')  + "RegExp " +
      + pattern + ' didn\'t match \'' + input+ '\' ' , 'matches',arguments.callee)
  //JSON doesn't write functions, (i.e. regexps,). make a custom message
  }
, like: function (actual,expected,respect,message) {
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

    if(a != e)
      assert.fail(a, e
      , message , 'like',arguments.callee)
  }
, lessThan: function (actual,expected, message) {
    if(!(actual < expected))
      assert.fail(actual, expected, message, '<')
  }
, greaterThan: function (actual,expected, message) {
    if(!(actual > expected))
      assert.fail(actual, expected, message, '<')
  }
, lessThanOrEqual: function (actual,expected, message) {
    if(!(actual <= expected))
      assert.fail(actual, expected, message, '<')
  }
, greaterThanOrEqual: function (actual,expected, message) {
    if(!(actual >= expected))
      assert.fail(actual, expected, message, '<')
  }
, between: function (actual, hi, lo, message) {
    if (lo > hi) {
      var tmp = hi; hi = lo; lo = tmp;
    }
    if(!(actual > lo && actual < hi))
      assert.fail(actual, {min: lo, max: hi}, message, 'between')
  }
, betweenOrEqual: function (actual, hi, lo, message) {
    if (lo > hi) {
      var tmp = hi; hi = lo; lo = tmp;
    }
    if(!(actual >= lo && actual <= hi))
      assert.fail(actual, {min: lo, max: hi}, message, 'betweenOrEqual')
  }
, isValidDate: function (actual, message) {
    var parsed = new Date(actual)
    if('Invalid Date' == parsed)
      assert.fail(actual, parsed, message, 'is a valid date')
  }
, contains: function (actual, expected, message) {
    var i = actual.indexOf(expected)
    if(-1 === i)
      assert.fail(actual, expected, message, 'contains')
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
    exports.strictEqual(actual, null, message)
  }
, isEmpty: function (actual, message) {
    exports.deepEqual(actual, [], message)
  }
}

exports.function = exports.ifFunction 
exports.typeof = exports.isTypeof
exports.instanceof = exports.isInstanceof
exports.__proto__ = assert

//man, prototypal inheritence is WAY better than classical!
//if only it supported multiple inheritence. that would be awesome.

