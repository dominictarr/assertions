# Assertions

_assertions_ is a powerful assertion toolkit.  

there are many useful assertion functions,  
including a few _very useful_ higher order assertion functions.  
also, every function has a _curry form and these can be joined together to create reusable specs.

##here I'll explain:

assert that `bar` equals `foo`

``` js
var a = require('assertions')

a.equal(bar, foo)
```
create an assertion that anything equals `foo`

``` js
var equalFoo = a._equal(foo)

//apply it to some things...
equalFoo (bar)
equalFoo (baz)
equalFoo (zuk)
```

every function has a curry form with a leading "_",  
it skips the first arg,  
and returns an assertion function that you can pass the first arg to later!

okay, so why? 

this starts to get super awesome when you have, example, the `has` assertion:

``` js
//assert that bar has a property letters: 3, and a name, which is a string.
a.has(bar, {
  letters: 3,
, name: function (actual) { a.isString(actual, 'make it a string!') }
})
```

`has` is kinda like `deepEqual` but only checks that the property matches if it's a primitive.  
if the property is a function then `has` assumes that it is an assertion function,  
and applys the function to the corisponding property on the `actual` object.  

lets rewrite the above example using the curry form:

``` js
//assert that bar has a property letters: 3, and a name, which is a string.
var validTLA = a._has({
  letters: 3,
  name: a._isString('make it a string!')
}, 'must be a real Three Letter Acronym')
```
now we can check that every thing is a valid TLA, oh yeah, lets use the higher order assertion `every`

``` js
a.every([
  {name: 'WTF', letters: 3},
  {name: 'OMG', letters: 3},
  {name: 'BBQ', letters: 3},
  {name: 'TLA', letters: 3},
  {name: 'DSL', letters: 3}
], validTLA)
```

we can now use `validTLA` where ever we need to check that something is a TLA, not just in our tests.

## Error Messages
one of the best things about assertions is that it creates very detailed error messages.

``` js
a.every([
  {name: 'WTF', letters: 3},
  {name: 'TLA', letters: 3},
  {name: 'IMHO', letters: 4}
  ], validTLA)
```

will give you a message like this, showing each step of where it went wrong!

``` js
equal: 4 == 3
has: ({ name: "IMHO", letters: 4 }).letters must match { letters: 3, name: isString }).letters
every: every[2] (== { name: "IMHO", letters: 4 }) must pass has, 
  (2 out of 3 have passed)
    at Object.equal (/home/dominic/source/dev/assertions/elementary.js:11:18)
    at Object.leaf (/home/dominic/source/dev/assertions/higher.js:175:16)
    ...
```

## assertion(actual [, expected...], message)

that is the raw form of all assertions. this convention is borrowed from the nodejs `assert` module.

some times `expected` is not necessary, or is optional, 
or may take multiple args. see assertion docs.

if the assertion takes optional args, the last arg is always `message` if it is a string.

## License

MIT
