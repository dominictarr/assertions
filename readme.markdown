## Assertions

an extensive set of assertion functions,   
with higher order functions to create reusable specs for both testing _and validation_.

## basic functions 

...

## higher order functions

has, every, all, any, path, atIndex, property, notAny, notEvery, noop

## curried functions _*

all assertion functions also have a `_assertion` form,  
that returns a `specification` function.  
the _function takes the tail of the `assertion`'s arguments,  
(everything except the actual, which is always first)  

the specification function only takes one argument, `actual`.
when a `specification` function is called, it executes the assertion.

this is very useful for passing to the higher order functions, which also have _function forms

var _isValidRequest = 
  _all(
    _has({
      headers: _isObject('must have headers!!!') // {} would mean the same thing here but this way we can add a message
    }),
    _ok()
  )
  
then, you can apply validation to things!

  _isValidRequest(req)
  
  