
var render = require('render')
  , fomatto = require('fomatto').Formatter({
      cf: render.cf, 
      render: renderer, 
      JSON: JSON.stringify,
      path: renderPath,
      'function': nameFunction 
    })

function nameFunction (f) { 
  if('function' !== typeof f) return f
  return f.name || f._name || (f.toString().length < 100 ? f.toString() : f.toString().slice(0,97)+'...')
}

function renderer (o) {
  return render(o, {
    surround: function (val, p, def) {
      return 'function' == typeof p.value ? nameFunction(p.value) : def(val, p)
    }
  })
}
/*
generating error messages

  assertion
    message

  property(null, 'hello')
    property: null did not have 'hello'
    
  property([0], '0', _isTruthy)
    property: '0' of '[0]' did not pass isTruthy
    isTruthy: 0 != true

  all(3, _isTruthy, _isNumber, _isEven)
  
    all: 3 did not pass '_isTruthy', '_isNumber' and '_isEven'
    isEven: 3 is not even

what is the structure here?
name: actual 'opperator' expected

and higher assertions need a way to wrap the lower assertions

  try {
    assertion(actual, expected, message) // ?
  } catch (fail) {
    throw fail.explain(name, actual, expected, opperator, message)
  }

  name: actual opperator assertion
  assertion: actual opperator expected
  message
  
*/

function renderPath(path){
  if('function' !== typeof path.map) return "<path:" + render(path) + ">"
  return path.map(function (e){
    if(!isNaN(e))
      return '[' + e + ']'
    if(/^\w+$/.test(e))
      return '.' + e
    return '[' + JSON.stringify(e) + ']' 
  }).join('')
}
/*
function renderPath(p){
  return p.map(function (e){
    if(!isNaN(e))
      return '[' + e + ']'
    if(/^\w+$/(e))
      return '.' + e
    return '[' + JSON.stringify(e) + ']' 
  }).join('')
}*/


function setup(e) {

  e.explaination = []
  e.explain = function (template, parts, message) {
    e.explaination.push({
      template: template,
      parts: parts,
      message: message
    })
    return e
  }
  e.simple = function (name, actual, expected, operator, message) {
    return e.explain(
        name + ': {actual} {operator} {expected}'
      , { actual: actual
        , expected: expected
        , operator: operator }
      , message
    )
  }
  e.toString = function () {
    return e.explaination.map(function (e) {
      return (
        fomatto(e.template, e.parts)
      + ( e.message  ? '\n  ' + fomatto(e.message, e.parts) : '' )
      )
    }).join('\n')  
  }
 
  e.__defineGetter__('message', function () {
    return '' + e
  })
  return e
  
}

exports.fail = 
function fail(e) {
  
  if(e && e.explain) 
    return e
  else if (e && e.name == 'AssertionError') {
      var opts = {actual: e.actual , expected: e.expected, operator: e.operator}
        , m = e.message      
      return setup(e).explain('AssertionError: {actual:render} must {operator} {expected:render}', opts, m)
    }
  else if (e instanceof Error) {
      var message = e.toString() || 'UNKNOWN ERROR'
      var e = setup(e)
        if(message !== 'Error') e.explain(message, {}) //only add the error message if it's interesting
    }
  else {
    var a = e
    e = setup(new Error())
    if (arguments.length)
      e.explain('thrown: {error:render} (typeof {typeof})', {error: a, 'typeof': typeof a}, '')
  }

  return e
}