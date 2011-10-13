
var render = require('render')
  , fomatto = require('fomatto').Formatter({
      cf: render.cf, 
      render: function (val) {return render(val)}, 
      JSON: JSON.stringify,
      path: renderPath
    })

function renderPath(p){  
  return p.map(function (e){
    if(!isNaN(e))
      return '[' + e + ']'
    if(/^\w+$/(e))
      return '.' + e
    return '[' + JSON.stringify(e) + ']' 
  }).join('')
}


function setup(e) {

  e.explaination = []
  e.explain = function (template, parts, message) {
    e.explaination.unshift({
      template: template,
      parts: parts,
      message: message
    })
    return e
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
  else if (e instanceof Error)
    return setup(e)
  else {
    var a = e
    e = setup(new Error())
    if (arguments.length)
      e.explain('thrown: {error:JSON} typeof {typeof}', {error: a, 'typeof': typeof a}, '')
  }

  return e
}