var loop = require('virtual-raf')
var createStore = require('store-emitter')
var assert = require('assert')
var xtend = require('xtend')

/**
* Create the app.
* @name createVirtualApp
* @param {Object} container – DOM element that will act as parent element
* @param {Object} vdom – the full virtual-dom module returned by `require('virtual-dom')`
* @example
* var createVirtualApp = require('virtual-app')
*
* var app = createVirtualApp(document.body, require('virtual-dom'))
*/
module.exports = function createVirtualApp (vdom) {
  assert.equal(typeof vdom, 'object', 'vdom must be an object')

  var app = {
    vdom: vdom
  }

  /**
  * Start the app.
  * @name app.start
  * @param {Function} modifier – function that determines how the state will change based on the action
  * @param {Object} initialState – the state of the application when it loads
  * @example
  * function modifier (action, state) {
  *   if (action.type === 'example') {
  *     return { example: true }
  *   }
  * }
  *
  * var render = app.start(modifier, {
  *   example: false
  * })
  *
  * render(function (state) {
  *   if (state.example) {
  *     return app.h('h1', 'this is an example')
  *   } else {
  *     return app.h('h1', 'what i thought this was an example')
  *   }
  * })
  */
  app.start = function virtualApp_start (modifier, initialState) {
    assert.equal(typeof modifier, 'function', 'modifier must be a function')
    assert.equal(typeof initialState, 'object', 'initialState must be an object')

    /**
    * Trigger an event that gets passed through the modifier function to change the state. A `type` property is required. You can add any other arbitrary properties.
    * @name app.store
    * @param {Object} action
    * @param {String} action.type – an identifier for the type of the action
    * @example
    * app.store({
    *   type: 'example'
    *   example: true
    * })
    */
    app.store = createStore(modifier, initialState)

    /**
    * Render the application. This function is returned by the `app.start()` method.
    * @name render
    * @param {Function} callback – define the virtual tree of your application and return it from this callback
    * @return {Object} DOM node tree
    * @example
    * var render = app.start(modifier, { food: 'pizza' })
    *
    * render(function (state) {
    *   return app.h('h1', state.food)
    * })
    */
    return function render (callback) {
      app.tree = loop(initialState, callback, vdom)
      if (typeof window !== 'undefined') {
        app.store.on('*', function (action, state) {
          app.tree.update(state)
        })
      }
      return app.tree.render()
    }
  }

  /**
  * Event listener
  * @name app.on
  * @param {String} event – can be an asterisk `*` to listen to all actions or the type of a specific action
  * @param {Function} callback – callback that provides `action`, `state`, and `oldState` arguments
  * @example
  * app.on('*', function (action, state, oldState) {
  *   // do something with the new `state`
  * })
  */
  app.on = function virtualApp_on (event, callback) {
    app.store.on(event, callback)
  }

  /**
  * virtual-dom `h` function.
  * @name app.h
  */
  app.h = function virtualApp_element (selector, options, children) {
    return vdom.h(selector, options, children)
  }

  /**
  * Bind an event to a component. Convenience wrapper around `app.store`.
  * @name app.send
  * @param {Object} action
  * @param {String} action.type – an identifier for the type of the action
  * @param {String} flag – call preventDefault on event (default: true)
  * @example
  * app.h('button', { onclick: app.send({ type: 'increment' })}, 'click me')
  */
  app.send = function virtualApp_send (action, flag) {
    if (typeof flag === undefined) flag = true
    return function virtualApp_send_thunk (e) {
      if (flag && e && e.preventDefault) e.preventDefault()
      app.store(action)
    }
  }

  return app
}
