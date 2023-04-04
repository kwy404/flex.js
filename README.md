# Flex - Singleton Implementation
This is a JavaScript implementation of a singleton object that binds data to elements in the DOM using a simple syntax.

How it works
The FlexInstance object creates a Flex object that handles data binding to elements in the DOM. The Flex object is created using a createInstance function that takes an options object with the following properties:

el: the selector for the root element to which data should be bound (default is 'html').
state: an object containing the initial state of the application.
methods: an object containing methods that can be called by bindings in the DOM.
The Flex object uses two helper functions:

parseText: a function that parses text and finds bindings using the syntax {{variableName}}.
parseHTML: a function that parses HTML and returns the first element found.
The Flex object creates a proxy object to observe changes to the state, and it finds elements in the DOM and binds data to them using the startApp method. The updateElements method updates elements that depend on changed state properties. The setupMethods method sets up methods on the Flex object that can be called by bindings in the DOM.

How to use
To use FlexInstance, simply create a Flex object using the getInstance method of the FlexInstance singleton. You can then use the state and methods properties of the Flex object to bind data and create methods for your application.

Here is an example usage:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Flex Example</title>
  </head>
  <body>
    <div id="app">
        <h1>{ title }</h1>
        <h2>{ message }</h2>
        <button @click="chanceTitle">Chance Title</button>
    </div>     
    <script src="../build/flex.min.js"></script>
    <script>
        const myApp = FlexInstance.create({
            el: '#app',
            state: {
                title: 'My Application',
                message: 'Message'
            },
            methods: {
                logMessage: function() {
                    console.log(this.state.message);
                },
                chanceTitle(){
                    this.state.title = "Hello, Flex"
                }
            }
        });

        //Chance title
        myApp.getInstance().state.title = 'New Title'; // Changes the title in the DOM
        // Changes the message in the DOM
        myApp.getInstance().state.message = 'I love ❤️ Flex'; 
    </script>
  </body>
</html>
```
License
This implementation is licensed under the MIT license.