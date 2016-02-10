var test = require('tape')
var vdom = require('virtual-dom')
var createApp = require('./index')

test('create the app', function (t) {
  var app = createApp(vdom)
  t.ok(app)
  t.ok(app.vdom)
  t.equal(typeof app.h, 'function')
  t.equal(typeof app.on, 'function')
  t.equal(typeof app.start, 'function')
  t.end()
})

test('receive an action in the modifier function', function (t) {
  var app = createApp(vdom)

  function modifier (action, state) {
    t.equal(action.type, 'example')
    t.end()
  }

  app.start(modifier, {
    example: false
  })

  app.store({
    type: 'example',
    example: true
  })
})

test('render should return dom tree', function (t) {
  var app = createApp(vdom)

  function modifier (action, state) {
    // noop
  }

  var tree = app.start(modifier, {
    example: false
  })

  t.ok(typeof tree, 'object')
  t.ok(typeof tree.firstChild, 'object')
  t.end()
})
