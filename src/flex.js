const FlexInstance = (function() {
    let instance;
  
    function createInstance({
      root = 'html',
      state = {},
      methods = {}
    }) {
      /* Function to parse text and find bindings */
      function parseText() {
        const BINDING_RE = /\{(.+?)\}/;
        return {
          text: function(text) {
            if (!BINDING_RE.test(text)) return null;
            let m, i, tokens = [];
            while ((m = text.match(BINDING_RE))) {
              i = m.index;
              if (i > 0) tokens.push(text.slice(0, i));
              tokens.push({
                text: m[0],
                key: m[1].trim()
              });
              text = text.slice(i + m[0].length);
            }
            if (text.length) tokens.push(text);
            return tokens;
          }
        }
      }
  
      /* Function to parse HTML and return the first element found */
      function parseHTML(html) {
        return document.querySelector(html).cloneNode(true);
      }
  
      class Flex {
        constructor() {
          this.parseText = parseText();
          this.root = root;
          this.state = this.createStateProxy(state);
          this.rootements = Array.from(document.querySelectorAll(`${this.root} *`)).filter(
            element => element.childNodes.length && element.textContent.trim() !== ""
          );
          this.cloneNode = parseHTML(this.root);
          this.startApp();
          this.setupMethods({
            methods
          });
        }
  
        /* Creates a Proxy object to observe changes to state */
        createStateProxy(state) {
          return new Proxy(state, {
            set: (obj, prop, value) => {
              obj[prop] = value;
              this.updateElements(prop);
              return true;
            },
          });
        }
  
        /* Find elements in the DOM and bind data */
        startApp() {
          this.rootements.forEach((element, index) => {
            if (element.nodeType === Node.TEXT_NODE) {
              const tokens = this.parseText.text(element.textContent);
              if (tokens) {
                tokens.forEach((token) => {
                  if (token.key) {
                    element.textContent = element.textContent.replace(
                      token.text,
                      this.state[token.key]
                    );
                  }
                });
              }
            } else {
              Array.from(element.childNodes).forEach((childNode) => {
                if (childNode.nodeType === Node.TEXT_NODE) {
                  const tokens = this.parseText.text(childNode.textContent);
                  if (tokens) {
                    tokens.forEach((token) => {
                      if (token.key) {
                        childNode.textContent = childNode.textContent.replace(
                          token.text,
                          this.state[token.key]
                        );
                      }
                    });
                  }
                }
              });
            }
          });
        }
  
        /* Updates elements that depend on changed state properties */
        updateElements(prop) {
          const elActual = document.querySelectorAll(`${this.root} *`);
          const elClone = this.cloneNode.cloneNode(true);
  
          Array.from(elClone.querySelectorAll('*')).forEach((element, index) => {
            const targetElement = elActual[index];
            if (element.nodeType === Node.TEXT_NODE) {
              const tokens = this.parseText.text(element.textContent);
              if (tokens) {
                let newTextContent = element.textContent;
                tokens.forEach((token) => {
                  if (token.key) {
                    newTextContent = newTextContent.replace(token.text, this.state[token.key]);
                  }
                });
                targetElement.textContent = newTextContent;
              }
            } else {
              Array.from(element.childNodes).forEach((childNode, childIndex) => {
                if (childNode.nodeType === Node.TEXT_NODE) {
                  const tokens = this.parseText.text(childNode.textContent);
                  if (tokens) {
                    let newTextContent = childNode.textContent;
                    tokens.forEach((token) => {
                      if (token.key) {
                        newTextContent = newTextContent.replace(token.text, this.state[token.key]);
                      }
                    });
                    targetElement.childNodes[childIndex].textContent = newTextContent;
                  }
                }
              });
            }
          });
        }
        /* Set up methods on the Flex object */
        setupMethods({
          methods = {}
        }) {
          const clickElems = Array.from(document.querySelectorAll(`${this.root} *`));
          const nodeOld = Array.from(document.querySelectorAll(`${this.root} > *`)); // correção aqui
          const flex = this;
          nodeOld.forEach((elem, index) => {
            const attrs = elem.attributes;
            for (let i = 0; i < attrs.length; i++) {
              const attr = attrs[i];
              const methodName = attr.name;
              const attrMethod = methodName.replace('@', '');
              if (methodName && methodName[0] === '@') {
                const methodName_ = elem.getAttribute(methodName);
                clickElems[index].addEventListener(attrMethod, function() {
                  if (typeof methods[methodName_] === 'function') {
                    methods[methodName_].call(flex);
                  }
                });
                elem.removeAttribute(methodName);
                elem.cloneNode(true);
              }
            }
          });
        }
      }
  
      return {
        getInstance: function() {
          if (!instance) {
            instance = new Flex();
          }
          return instance;
        }
      };
    }
  
    return {
      create: function(options) {
        return createInstance(options);
      }
    };
})();