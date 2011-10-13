var assert = require('assert')
  , extended = require('./extended')
  , traverser = require('traverser')
  , render = require('render')

module.exports = {
  every: every,
  has: has,
  apply: apply
}

function apply (actual, assertion, message) {
  
  //catch and wrap in message
  
  assertion (actual)

}

function every (array,func){
  try{
  assert.equal(typeof array,'object',"*is not an object*")
  }catch(err){
    err.every = array
    err.index = -1
    throw err
  }
  for(var i in array){
    try {
      func.call(null,array[i])
    } catch (err) {
      if(!(err instanceof Error) || !err.stack){
        var n = new Error("non error type '" + err + "' thrown as error.")
        n.thrownValue = err
        err = n
      }
      err.every = array
      err.index = i
      throw err
    }
  }
}

function has(obj,props) {
  var pathTo = []
  
  //traverser has lots og functions, so it needs a longer stack trace.
  var orig = Error.stackTraceLimit 
  Error.stackTraceLimit = orig + 20

  try{
    assert.ok(obj,"it has no properties!")
    assert.ok(props)

    traverser(props,{leaf:leaf, branch: branch})
  } catch (err){
      if(!(err instanceof Error) || !err.stack) {
        var n = new Error("non error type '" + err + "' thrown as error.")
        n.thrownValue = err
        err = n
      }
      err.stack = 
        "it/asserters.has intercepted error at path: " 
          + renderPath(pathTo) + "\n" + err.stack
      err.props = props
      err.object = obj
      err.path = pathTo
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
    assert.equal(other,p.value)
    }
  }
  function branch (p){
    pathTo = p.path

    var other = path(obj,p.path)
    if('function' !== typeof p.value)
      extended.complex(other, 'expected that ' + JSON.stringify(other) + ' can have properties')
//    if(other && 'object' != typeof 'object')
//      assert.fail(other, null ,message," can have properties ",arguments.callee)
    p.each()
  }
}

function path(obj,path,message){
  var object = obj
  for(i in path){
    var key = path[i]
    obj = obj[path[i]]
    if(obj === undefined) 
      assert.fail("expected " + render(object),renderPath(path),message,"hasPath",arguments.callee)
  }
  return obj
}

function renderPath(path){
  return path.map(function (e){
    if(!isNaN(e))
      return '[' + e + ']'
    if(/^\w+$/(e))
      return '.' + e
    return '[' + JSON.stringify(e) + ']' 
  }).join('')
}
