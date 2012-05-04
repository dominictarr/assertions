var extended = require('./extended')
  , elementary = require('./elementary')
  , traverser = require('traverser')
  , render = require('render')
  , fail = require('./failure').fail

module.exports = {
  every:    every,
  has:      has,
  apply:    apply,
  throws:   throws,
  path:     path,
  noop:     noop,
  atIndex:  atIndex,
  property: property,
  hasKeys:  hasKeys
}
function property (actual, property, value, message){

    function explain(err, template) {
      throw fail(err).explain(
                'property:'+template
              , { actual: actual
                , property: property
                , path: [property]
                , assertion: value
                }
              , message 
              )     
    }

    if(!actual[property] && value == null)
    //checks that property is defined on actual, even if it is undefined (but not deleted)
      explain(new Error(), 'property: {actual:render}{path:path} must exist')
    //if value is a function, assume it is an assertion... apply it to actual[property]
    if('function' == typeof value) {
      try { value(actual[property]) } catch (err) {
        explain(err, 'property: ({actual:render}){path:path} must pass {assertion:function}')
      }
    } else if (value != null) //else if value is exiting, check it's equal to actual[property]
      try { elementary.equal(actual[property], value) } catch (err) {
        explain(err, 'property: ({actual:render}){path:path} must equal {assertion:function}')
      }
      
    //if you want to assert a value is null or undefined,
    //use .property(name,it.equal(null|undefined))
  }


function path (actual, expected, assertion, message) {
  var current = actual
    , soFar = []
  if('string' == typeof expected) expected = [expected] //allow a singe key as a string
  if('function' != typeof assertion) message = assertion, assertion = noop

  for ( var i in expected) {
    var key = expected[i]
    current = current[key]
    soFar.push(key)
    if(!(typeof current !== 'undefined')) // check if there actually is a property 
      throw fail (new Error()).explain(
          'path: ({actual:render}){soFar:path} must exist, (is undefined), expected path: {path:path}'
        , { actual: actual, soFar: soFar, path:expected}
        , message
        )
  }
 
  try {
    assertion(current)
  } catch (err) {
    throw fail(err).explain(
        'path: expected ({actual:render}){path:path} to pass {assertion:function}'
      , { actual: actual
        , path: expected
        , assertion: assertion
        , current: current  }
      , message 
    )
  }
    return current
}

function apply (actual, assertion, message) {
  
  //catch and wrap in message
  try {
    assertion (actual)
  } catch (err) {
    throw fail(err).explain('apply: {actual:render} did not pass {assertion:function}', {
      actual: actual,
      expected: assertion,
      assertion: assertion 
    }, message)
  }

}

function noop () {}

function throws (actual, assertion, message) {
  if('string' == typeof assertion) message = assertion, assertion= noop
  if(!assertion) assertion = noop
  try {
    actual()
  } catch (err) {
    try {
      return apply (err, assertion, message)
    } catch (f) {
      throw f.explain(
          'throws: {actual} threw an exception that did not pass {assertion:function}'
        , {actual: actual, assertion: assertion}
        , message
      )
    }
  }
  throw fail().explain('throws: {actual} did not throw', {actual: actual, expected: assertion}, message)

}

function every (array, assertion, message){

  try{
    extended.isArray(array)
  }catch(err){
    throw fail(err).explain('every: {actual:render} must be an Array')
  }
  for(var i in array){
    try {
      assertion.call(null,array[i])
    } catch (err) {
      throw fail(err).explain(
          'every: every[{index}] (== {actual:render}) must pass {assertion:function}, \n  ({index} out of {every.length} have passed)'
        , { index: i
          , every: array
          , assertion: assertion
          , actual: array[i]
          }
        , message
        )
    }
  }
}

function has(obj, props, message) {
  var pathTo = []
  //traverser has lots of functions, so it needs a longer stack trace.
  var orig = Error.stackTraceLimit 
  Error.stackTraceLimit = orig + 20

  if('object' !== typeof props)
    return elementary.equal(obj, props)

  try{
    traverser(props, {leaf:leaf, branch: branch})
  } catch (err){
      err = fail(err).explain(
          'has: ({actual:render}){path:path} must match {expected:render}){path:path}'
        , { actual: obj
          , expected: props
          , path: pathTo
          }
        , message
        )
      Error.stackTraceLimit = orig

      throw err
  }
  function leaf(p){
    pathTo = p.path
    var other = path(obj,p.path)
    if('function' == typeof p.value){
      p.value.call(p.value.parent,other)
    } 
    else {
    //since this is the leaf function, it cannot be an object.
    elementary.equal(other,p.value)
    }
  }
  function branch (p){
    pathTo = p.path

    var other = path(obj,p.path)
    if('function' !== typeof p.value)
      extended.complex(other)
    p.each()
  }
}

function atIndex (actual, relativeIndex, assertion, message) {

  var index = relativeIndex < 0 ? actual.length + relativeIndex : relativeIndex
    , minLength = Math.abs(relativeIndex)
    ;

  function explain(err, template) {
    throw fail(err).explain('atIndex: ' + template
      , {actual: actual
        , index: index
        , relativeIndex: relativeIndex
        , minLength: minLength
        , assertion: assertion
        }
      , message)
  }

  if(!(actual))
    explain(new Error(), '{actual:render} must not be null')
  if(!(actual.length))
    explain(new Error(), '{actual:render} must have length property')
  if(!(actual.length > minLength))
    explain(new Error(), '{actual:render}.length (== {actual.length}) must be greater than {minLength}')

  if(!('function' == typeof assertion))
    message = assertion, assertion == noop
  try {
    assertion(actual[index])
  } catch (err) {
    explain(err, '({actual:render})[{index}] must pass {assertion:function}')
  }
}

function hasKeys (actual, keys, assertion, message) {
  if('string' == typeof assertion) message = assertion, assertion= noop
  if(!assertion) assertion = noop
  
  function explain(err, template) {
    throw fail(err).explain('hasKeys: ' + template, 
      {actual: actual, key: key, path: [key], keys: keys, assertion: assertion}, 
      message)  
  }
  
  keys.forEach (function (key) {
    if('undefined' == typeof actual[key])
      explain(new Error(),'{actual:render} must have key: {key:JSON}')
    try {
      assertion (actual[key])
    } catch (err) {
      explain('hasKeys: ({actual:render}){path:path} must pass: {assertion:function}')
    }
  })

}

/*
higher level assections that could be implemented:

  * all(actual, assertions..., message)         //all assertions must pass
  * any(actual, assertions..., message)         //at least one assertion must pass
                                                //if index is negative, take index as length + index

  refactor so that whereever it says 'assertion', if it's not a function : use equal.
*/
