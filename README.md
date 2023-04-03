# Flex.js
Flex.js is a small JavaScript library for automatically updating the content of the DOM (Document Object Model) based on state changes. It allows you to create declarative UI elements and simply bind them to an internal state. Whenever the state is updated, the library automatically updates the corresponding DOM content.

How it works
Flex.js uses the JavaScript Proxy API to track state changes and update the corresponding DOM content whenever the state is updated. It parses the DOM content for declarative model tokens, which correspond to properties in the state object. When a property in the state object changes, the library updates the DOM content that corresponds to the affected model tokens.

Usage
Instantiating Flex
To create a new instance of Flex, simply call the constructor with an options object that defines the el, state, and methods properties.

```javascript
const flex = new Flex({
  el: '#app',
  state: {
    greeting: 'Hello, World!'
  },
  methods: {
    sayHi() {
      alert(this.state.greeting);
    }
  }
});
```
Defining a State Object
The state object defines the initial state of your application. Any properties in the state object can be used as model tokens in your DOM content.

```javascript
const state = {
  greeting: 'Hello, World!',
  count: 0,
  items: [
    'Apples',
    'Bananas',
    'Oranges'
  ]
};
```
Updating the State Object
To update the state object, simply modify the properties of the state object.

```
flex.state.greeting = 'Hello, Flex.js!';
```
Defining Model Tokens
Model tokens are used to bind the content of a DOM element to a property in the state object. They are defined in your HTML content using the {{propertyName}} syntax.

```html
<div>
  {{greeting}}
</div>
```
Using Methods
Flex.js also allows you to define methods that can be called in response to DOM events. These methods are defined in the methods object, which is passed as an option when creating a new instance of Flex.

```javascript
const methods = {
  handleClick() {
    this.state.count++;
  }
};
```
In your HTML content, you can call these methods using the :eventName syntax.


```html
<button :click="handleClick">Increment</button>
```