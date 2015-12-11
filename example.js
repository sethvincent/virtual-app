var extend = require('xtend')
var vdom = require('virtual-dom')
var createApp = require('./index')

/*
* create the app passing the container element and virtual-dom
*/
var app = createApp(document.body, vdom)

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
  example: false
})

/*
* return the tree of your app for rendering
*/
render(function (state) {
  return app.h('h1', state.title)
})

/*
* get the new state every time an action updates the state
*/
app.on('*', function (action, state, oldState) {
  console.log('action happened so here is the new state:', state)
})

/*
* listen to only specific action types
*/
app.on('title', function (action, state, oldState) {
  console.log('state has a new title:', state.title)
})

/*
* trigger an action using `app.store()`
*/
app.store({
  type: 'example'
})

/*
* action objects must have a `type` property, and can have any other arbitrary properties
*/
app.store({
  type: 'title',
  title: 'awesome example'
})
