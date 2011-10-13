
var higher = require('../higher')
  , assert = require ('assert')
  
exports ['apply an assertion'] = function () {
  var called = 0
  assert.doesNotThrow(function () {
    higher.apply(true, function (actual) {
      assert.equal(actual, true)
      called ++
    })
  })
  assert.equal(called, 1)
}

exports ['apply an failing assertion'] = function () {
  var called = 0
  assert.throws(function () {
    higher.apply(false, function (actual) {
      called ++
      assert.equal(actual, true)
      called ++ //should not evaluate
    })
  })
  assert.equal(called, 1)
}

exports ['apply a failing assertion, with message'] = function () {
  var called = 0

  try {
    higher.apply(false, function isTruthy(actual) {
      called ++
      assert.equal(actual, true)
      called ++ //should not evaluate
    }, '$actual did not pass $expected')
  } catch (error) {
    //assert.deepEqual(error.explain)
  }
  assert.equal(called, 1)
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
