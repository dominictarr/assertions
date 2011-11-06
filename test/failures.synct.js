
var failure = require('../failure')
  , render = require('render')
  , assert = require('assert')

var stderr = console.error

/*
throw failures.fail()
    .explain('okay: {actual} != {expected}', {actual: false, expected: true}, '')
    .explain('property: ({actual:JSON}){expected:path} did not pass {assertion}'
      , { actual:[false]
        , expected: [ 0 ]
        , assertion: 'okay()'
        }, 'here is a bit more explaination')

*/

exports['simple - toString'] = function () {

  var f = failure.fail()
  assert.equal(typeof f.explain, 'function')
  assert.deepEqual(f.explaination, [])

  f.explain('template: {actual} opperator {expected}', {actual: 1, expected: 2}, 'message here')
  
  assert.equal(f.toString(), 'template: 1 opperator 2\n  message here')

  assert.ok(~f.stack.indexOf('template: 1 opperator 2'))
}

exports ['pass it another failure'] = function () {

  var f = failure.fail()
    , _f = failure.fail(f)

  assert.equal(_f, f)

}

exports ['pass it another error'] = function () {

  var f = new Error ('ERROR MESSAGE')
    , _f = failure.fail(f)

  assert.equal(typeof _f.explain, 'function')
  assert.ok(~f.stack.indexOf('ERROR MESSAGE'))
}

exports ['pass it a primitive'] = function () {

  var str = 'hello there'
  var f = failure.fail(str)

  assert.equal(typeof f.explain, 'function')
  assert.ok(~f.stack.indexOf('hello there'))
  
}

exports [ 'integrate AssertionErrors (keep messages)'] = function () {
  var err = (function () { try { assert.ok(false, 'message is here') } catch (err) {return err} } )()
  var f = failure.fail(err)

  assert.equal(typeof f.explain, 'function')
  assert.ok(~f.stack.indexOf('false must == true'), 'should still have any preexisting error message')
  assert.ok(~f.stack.indexOf('message is here'), 'should still have any preexisting error message')
}

exports [ 'integrate AssertionErrors add second explaination'] = function () {
  var err = (function () { try { assert.ok(false, 'message is here') } catch (err) {return err} } )()
  var f = failure.fail(err).explain('adding another message!', {}, 'more message')

  console.error(f.stack)
  assert.equal(typeof f.explain, 'function')
  assert.ok(~f.stack.indexOf('false must == true'), 'should still have any preexisting error message')
  assert.ok(~f.stack.indexOf('message is here'), 'should still have any preexisting error message')
  assert.ok(~f.stack.indexOf('adding another message!'), 'should have 2nd message: "adding another message!"')
  assert.ok(~f.stack.indexOf('more message'), 'should have 2nd message: "more message"')
}
