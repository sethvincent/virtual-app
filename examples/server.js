var http = require('http')
var extend = require('xtend')
var vdom = require('virtual-dom')
var createApp = require('../index')
var h = vdom.h

/*
* create the app passing the container element and virtual-dom
*/
var app = createApp(vdom)

/*
* The only way to modify state is to trigger an action
* the modifer function is where you change state based on the type of an action
*/
function modifier (action, state) {
  if (action.type === 'example') {
    return extend(state, { example: true })
  } else if (action.type === 'title') {
    return extend(state, { title: action.title })
  }
}

/*
* Start the application with the modifier function and the initial state as args
* `app.start()` returns the `render()` function that's used to render your virtual tree
*/
var render = app.start(modifier, {
  example: false,
  title: 'My web page title'
})

/*
* return the tree of your app for rendering
*/
var domTree = render(function (state) {
  return h('.app', [
    h('h1', state.title)
  ])
})

http.createServer(function (request, response) {
  var htmlPage = domTree.toString()
  response.writeHead(200, {'Content-Type': 'text/html'})
  response.end(htmlPage)
}).listen(8124)

console.log('Server running at http://127.0.0.1:8124/')
