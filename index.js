var loop = require('virtual-raf')
var createStore = require('store-emitter')

/**
* Create the app.
* @name createVirtualApp
* @param {Object} container – DOM element that will act as parent element
* @param {Object} vdom – the full virtual-dom module returned by `require('virtual-dom')`
* @example
* var createVirtualApp = require('virtual-app')
*
* var app = require(document.body, require('virtual-dom'))
*/
module.exports = function createVirtualApp (container, vdom) {
  if (!container) throw new Error('container and virtual-dom arguments required')
  if (!vdom) throw new Error('virtual-dom argument is required')

  var app = {
    container: container,
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
    if (!modifier) throw new Error('modifier and initialState arguments required')
    if (!initialState) throw new Error('initialState argument is required')

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
    * @example
    * var render = app.start(modifier, { food: 'pizza' })
    *
    * render(function (state) {
    *   return app.h('h1', state.food)
    * })
    */
    return function render (callback) {
      app.tree = loop(initialState, callback.bind(app), vdom)
      app.container.appendChild(app.tree.render())

      app.store.on('*', function (action, state) {
        app.tree.update(state)
      })
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
  * @example
  * app.h('button', { onclick: app.send({ type: 'increment' })}, 'click me')
  */
  app.send = function virtualApp_send (action) {
    return function virtualApp_send_thunk () {
      app.store(action)
    }
  }

  return app
}
