# virtual-app

A wrapper around [virtual-dom](https://npmjs.com/virtual-dom), [virtual-raf](https://npmjs.com/virtual-raf), & [store-emitter](https://npmjs.com/store-emitter) that provides redux-like, unidirectional state management paired with virtual-dom.

## What is this

I keep writing essentially this module with each new project I build that uses virtual-dom.

You could definitely use virtual-dom, virtual-raf, and store-emitter separately (and switch them out for other modules) if this doesn't fit your needs exactly.

## Install

    npm install --save virtual-app

## Example

```js
var extend = require('xtend')
var vdom = require('virtual-dom')
var createApp = require('virtual-app')

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
```

## API

### app.h

virtual-dom `h` function.

**Parameters**

-   `selector`
-   `options`
-   `children`

### app.on

Event listener

**Parameters**

-   `event` **String** – can be an asterisk `*` to listen to all actions or the type of a specific action
-   `callback` **Function** – callback that provides `action`, `state`, and `oldState` arguments

**Examples**

```javascript
app.on('*', function (action, state, oldState) {
  // do something with the new `state`
})
```

### app.start

Start the app.

**Parameters**

-   `modifier` **Function** – function that determines how the state will change based on the action
-   `initialState` **Object** – the state of the application when it loads

**Examples**

```javascript
function modifier (action, state) {
  if (action.type === 'example') {
    return { example: true }
  }
}

var render = app.start(modifier, {
  example: false
})

render(function (state) {
  if (state.example) {
    return app.h('h1', 'this is an example')
  } else {
    return app.h('h1', 'what i thought this was an example')
  }
})
```

### app.store

Trigger an event that gets passed through the modifier function to change the state. A `type` property is required. You can add any other arbitrary properties.

**Parameters**

-   `action` **Object**
    -   `action.type` **String** – an identifier for the type of the action

**Examples**

```javascript
app.store({
  type: 'example'
  example: true
})
```

### app.send

Bind an event to a component. Convenience wrapper around `app.store`.
```js
app.h('button', { onclick: app.send({ type: 'increment' })}, 'click me')
```

### createVirtualApp

Create the app.

**Parameters**

-   `container` **Object** – DOM element that will act as parent element
-   `vdom` **Object** – the full virtual-dom module returned by `require('virtual-dom')`

**Examples**

```javascript
var createVirtualApp = require('virtual-app')

var app = require(document.body, require('virtual-dom'))
```

### render

Render the application. This function is returned by the `app.start()` method.

**Parameters**

-   `callback` **Function** – define the virtual tree of your application and return it from this callback

**Examples**

```javascript
var render = app.start(modifier, { food: 'pizza' })

render(function (state) {
  return app.h('h1', state.food)
})
```

## License

[MIT](LICENSE.md)
