

function error (bool, message) {
  if(!bool)
    throw new Error(message)

}

exports ['test'] = function () {
  var ab = function (a, b) {
    return [a, b]
  }

  var AB = ab('a', 'b')
  error(AB[0] == 'a', "expected AB[0] == 'a'")      
  error(AB[1] == 'b', "expected AB[1] == 'b'")      

  var _b = precurry(ab)
  
  error('function' == typeof _b, "expected 'function' == typeof _b")

  xB = _b('b')
  
  

}