//asserters.expresso.js

var asserters = require('../')
  , assert = require('assert')

var deleted_a = {a: true}
delete deleted_a.a

var a,b,c,d,e
var examples =
{ ok : {
    pass : [[1], [2], [-1], ['sadf'], [true], [[]], [{}]]
  , fail : [[0],[false],[null],[undefined]]
  }
  
, equal : {
    pass : [ [1,1], [2,2.0], [-1,-1], ['sadf','sadf'], [true,1]
           , [a = [], a], [b = {}, b]]
  , fail : [ [0,1], [[],[]] ]
  }
  
, isTypeof : {
    pass : [ [1, 'number']
           , [NaN, 'number']
           , ['', 'string']
           , [{}, 'object']
           , [null,'object']
           , [undefined, 'undefined'] ]
  , fail : [ [0, 'string'] ]
  }
  
, isString : {
    pass : [ ['uoeaueu'] ]
  , fail : [ [0], [/aoeuaoeu/], [{}], [[]], [true] ]
  }

, isNumber: {
    pass : [ [10], [0], [-1], [NaN], [-1.7976931348623157E+1030], , [1.7976931348623157E+1030] ]
  , fail : [ [/aoeuaoeu/], [{}], [[]], [true], [undefined] ]
  }
, isBoolean: {
    pass : [ [true], [false]]
  , fail : [ ['true'], ['false'], [0], [1], [null], [undefined] ]
  }
, isUndefined: {
    pass : [ [undefined]]
  , fail : [ ['true'], ['false'], [0], [1], [null], [true], [false] ]
  }
, isNull: {
    pass : [ [null]]
  , fail : [ ['true'], ['false'], [0], [1], [undefined], [true], [false] ]
  }
, isInstanceof : {
    pass : [ [{}, Object], [[], Object], [[], Array]
           , [new Error, Error], [function (){}, Function]]
  , fail : [ [{}, Array] ]
  }
, has : {// has basicially checks if expected is a sub tree of actual.
    pass : [ [{a: 1}, {a: 1}]
           , [{a: 1, b: 2}, {a: 1}]
           , [{a: 1}, {a: assert.ok}]  //also, it applies functions in expected 
           ]
  , fail : [ [{a: 1}, {a: 1, b: 2}]
           , [{a: 1}, {a: {}}] 
           , [{}, {a: {}}] 
           , [{a: false}, {a: assert.ok}] 
           ]
  }
, every : { 
    pass : [ [[1,2,3,4,5],assert.ok] ]
  , fail : [ [[1,2,3,4,5,false],assert.ok] ]
  }

, primitive : {
    pass : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  , fail : [ [null], [[]], [{}], [new Error], [function (){}] ]
  }
, complex : {
    pass : [ [null], [[]], [{}], [new Error], [function (){}] ]
  , fail : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  }
, isFunction : {
    pass : [ [function(){}], [Error], [({}).constructor] ]
  , fail : [ [1], [2], [3], ['sadgsdf'] [true], [false], [undefined] ]
  }
, matches : {
    pass : [ ['hello', /\w+/] , ['asdgsadg', /[a|s|d|g]+/] ]
  , fail : [ ['sgfg-', /^\w+$/] ]
  }
//like (actual,expected,{case:boolean,whitespace:boolean,quotes:boolean}) //all default to on.

, like : {
    pass : 
    [ ['hello\n', 'hello'] 
    , ['asdgsadg', 'ASDGSADG']
    , ['"quoted"', "'quoted'"]
    , ['1234', '1\n2\n3\n4\n']
    ]
  , fail : 
    [ ['hello\n', 'hello', {whitespace: true}] 
    , ['asdgsadg', 'ASDGSADG', {case: true}]
    , ['"quoted"', "'quoted'", {quotes: true}]
    ]
  }
, property : {
    pass : [ [{a:true}, 'a'], [[],'length',0], ['hello','length', 5], [{a:1}, 'a', assert.ok ], [{a:null}, 'a', function (actual){assert.equal(actual,null)} ] ]
  , fail : [ [{}, 'a'], [deleted_a, 'a'], [{a:undefined}, 'a'], ['hello','length', 7] ,[{a:false}, 'a', assert.ok]]
  }
, lessThan: {
    pass: [ [1, 2], [0, 1], [-1, 0] ]
  , fail: [ [1, 0], [0, 0] ] 
  }
, greaterThan: {
    pass: [ [1, 0] ] 
  , fail: [ [1, 2], [0, 1], [-1, 0], [0, 0] ]
  }
, lessThanOrEqual: {
    pass: [ [1, 2], [0, 1], [-1, 0], [0, 0] ]
  , fail: [ [1, 0] ] 
  }
, greaterThanOrEqual: {
    pass: [ [1, 0], [0, 0] ] 
  , fail: [ [1, 2], [0, 1], [-1, 0] ]
  }
, between: {
    pass: [ [1, 0, 2], [0, -1, 1] ] 
  , fail: [ [1, 2, 3], [0, 0, 1], [-1, 0] ]
  }
, betweenOrEqual: {
    pass: [ [1, 1, 2], [0, -1, 1], [0, 0, 0] ] 
  , fail: [ [1, 2, 3], [0, 0.1, 1], [-1, 0] ]
  }
, isValidDate: {
    pass: [ [new Date().toString()], [Date.now()], ['2009-06-29T11:11:55Z'] , [1], [null]] 
  , fail: [ [{}], ['euthoeu'] ]
  }
, contains: {
    pass: [ [[1,2,3], 1], [[1,2,3], 2], [['a', 'b', 'c'], 'c'], ['hello there' , 'hell']] 
  , fail: [ [[], 1], ['euthoeu', 'x'] ]
  }
, includes: {
    pass: [ [2, [1,2,3]], [3, [1,2,3]], ['c', ['a', 'b', 'c']], ['the', 'hello there']] 
  , fail: [ [1, []], ['x', 'euthoeu'] ]
  }
, isArray: {
    pass: [ [[]] ] 
  , fail: [ [{}], ['euthoeu'], [/ouoeu/], [42], [null], [true] ]
  }
, isEmpty: {
    pass: [ [[]] ]
  , fail: [ [ [1,2] ], [ 2 ], [true] ]
  }
}

exports ['check examples'] = function (){
//  check('ok')
  for(i in examples){
    check(i)
  }
}

function check(name){
  //check passes
  examples[name].pass.forEach(function (e,k){
    asserters[name].apply(null,e)
  })
  //check fails
  examples[name].fail.forEach(function (e){
    try {
    asserters[name].apply(null,e)
    } catch (err){
//      if(!(err instanceof assert.AssertionError))
  //      throw err
  
      return
    }
    assert.ok(false,"expected " + name + "(" + e.join() + ") to fail")
  })
}
  
exports ['every'] = function (){
  asserters.every([1,2,3,4,5,6],function (x){
    assert.ok('number' == typeof x)
  })
  assert.throws(function(){  
    asserters.every([1,2,'asda',4,5,6],function (x){
      assert.ok('number' == typeof x)
    })
  })
}

/*
  the node js behaviour here is annoying, and not consistant with my higher order assertions.
*/

/*
exports ['throws can check what object is thrown'] = function (){
  var called = 0
    , err = new Error("HELLO")
  var examples = 
  [ [ function () {throw err}
      , function (thrown) { called ++; assert.equal(thrown, err) } ]
  , [ function () {throw err}  ]
  ]
  examples.forEach(function (c){
    asserters.throws.apply(null,c)
  })

  assert.equal(1, called)
}
*/

exports ['every intercepts error, records item errored at'] = function (){
  var examples = 
  [ [ [1,2,3,4,5,null], assert.ok, 5] 
  , [ [null,'sadf','sadfg'], assert.ok, 0] 
  , [ [null,null,null,1], assert.ifError, 3]
  ]
  //  asserters.every([null,null,null,1], assert.ifError)
    
  examples.forEach(function (e){
    try {  
      asserters.every(e[0],e[1])
    } catch (err) {
      return
    }
    assert.ok(false, "expected 'every' to fail")
  })
}

exports ['has intercepts error, records path item errored at'] = function (){

  var examples = 
  [ [ {a: null}, {a: assert.ok}, ['a']] 
  , [ {'a-b-c': {0: {x: false } } }, {'a-b-c': {0 : {x:assert.ok}}}, ['a-b-c',0,'x']] 
  , [ {a:{}},{a:{b: 1}}, ['a','b']]
  ]

  examples.forEach(function (e){
    try {  
      asserters.has(e[0],e[1])
    } catch (err) {
      return 
    }
    assert.ok(false,"expected has to throw error at path " + inspect(e[2]))
  })

}
