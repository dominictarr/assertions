
var higher = require('../higher')
  , assert = require ('assert')
  , render = require('render')

exports ['apply an assertion'] = function () {
  var called = 0
//  assert.doesNotThrow(function () {
    higher.apply(true, function (actual) {
      assert.equal(actual, true)
      called ++
    })
  //})
  assert.equal(called, 1)
}

exports ['apply an failing assertion'] = function () {
  var called = 0
  assert.throws(function () {
    higher.apply(false, function isTruthy (actual) {
      called ++
      assert.equal(actual, true)
      called ++ //should not evaluate
    })
  })
  assert.equal(called, 1)
}

exports ['throws does not throw if block does'] = function () {
  var called = 0
  try {
    higher.throws(function () {null.x = 10}, function () {}, 'if the block does not throw, throws must')
  } catch (err) {
    called ++
  }
  assert.equal(called, 0)
}

exports ['on throws the assertion argument is optional'] = function () {
  var called = 0
  try {
    higher.throws(function () {null.x = 10}, 'if the block does not throw, throws must')
  } catch (err) {
    assert.notEqual(err.type, 'called_non_callable')
    called ++
  }
  assert.equal(called, 0)
}


exports ['throws if the block throws the wrong thing'] = function () {

  var called = 0
  try {
    higher.throws(
      function () {null.x = 10}
    , function (err) {
          assert.equal(err, 'the wrong thing')
      }
    , 'if the block does not throw, throws must')
  } catch (err) {
    called ++
  }
  assert.equal(called, 1)

}


exports ['apply a failing assertion, with message'] = function () {
  var called = 0

  try {
    higher.apply(false, function isTruthy(actual) {
      called ++
      assert.equal(actual, true)
      called ++ //should not evaluate
    }, 'false in not truthy')
  } catch (error) {
    //assert.deepEqual(error.explain)
  }
  assert.equal(called, 1)
}

function shouldFail (assertion) {
  return function () {
    var args = [].slice.call(arguments)
    try {
      assertion.apply(this, args)
    } catch (err) {
//      console.error(err)
      console.error('' + err)
      console.error()
      return
    }
    throw new Error(
      'expected ' + (assertion.name || assertion) + ' to fail with args: ' + render(args)
    )
  }
}

exports ['path'] = function () {
  
  higher.path({A: true}, ['A'], assert.ok, '.A must be truthy')
  shouldFail(higher.path)({A: false}, ['A'], assert.ok, '.A must be truthy')

  higher.path({A: 1}, ['A'], function () {}, '.A must be truthy')
  shouldFail(higher.path)({}, ['A'], function () {}, '.A must be truthy')
  
  higher.path({A: [true]}, ['A', 0], assert.ok, '.A[0] must be truthy')
  shouldFail(higher.path)({A: [true]}, ['A', 0], function (a) {assert.strictEqual(a, 1)}, '.A[0] must be 1')
}
//*/

exports ['has'] = function () {

  higher.has({a: 1}, {a: 1})
  higher.has({a: 1, b: 2}, {a: 1})
  higher.has({a: 1}, {a: assert.ok})  //also, it applies functions in expected 

  shouldFail(higher.has)({a: 1}, {a: 1, b: 2})
  shouldFail(higher.has)({a: 1}, {a: {}})
  shouldFail(higher.has)({}, {a: {}})
  shouldFail(higher.has)({a: false}, {a: assert.ok})

}

function isNumber (n) {
  assert.equal(typeof n, 'number')
}

exports ['every'] = function () {

  shouldFail(higher.every)([1, 2, 3, 'X'], isNumber, '{actual} must be a number')
  higher.every([1, 2, 3, 4], isNumber, '{actual} must be a number')
  higher.every([], isNumber, '{actual} must be a number') //this is okay, use a different assertion to check for non empty

}

/*
  actual must a value at index that passes an assertion
*/


exports['atIndex'] = function () {

  higher.atIndex([1, 2, 'X'], 0, isNumber)

  shouldFail(higher.atIndex)([1, 2, 'X'], 2, isNumber)
  shouldFail(higher.atIndex)([1, 2, 'X'], -1, isNumber)

  higher.atIndex([1, 2, 'X'], -2, isNumber)

  shouldFail(higher.atIndex)([1, 2, 'X'], 3)

}

exports['hasKeys'] = function () {

  higher.hasKeys({a: 1, b: null, c: 'whatever'}, ['a','b','c'], 'must have a,b,c')
  shouldFail(higher.hasKeys)({a: 1, b: null, c: 'whatever'}, ['a','b','c'], isNumber, 'must have numbers on a,b,c')
}

/*
  actual must pass all assections
*/

exports.all = function () {

}

/*
  actual must pass at least one assertion

  less useful that all?
*/

exports.any = function () {

}