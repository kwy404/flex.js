const FlexInstance = (function() {
  let instance;

  function createInstance({
    root = 'html',
    state = {},
    methods = {}
  }) {
    class Flex {
      constructor() {
        this.eachLoop = eachLoop
        this.ifCondition = ifCondition
        this.parseText = parseText();
        this.root = root;
        this.state = this.createStateProxy(state);
        this.prevState = {}
        this.rootements = Array.from(document.querySelectorAll(`${this.root} *`)).filter(
          element => element.childNodes.length && element.textContent.trim() !== ""
        );
        this.cloneNode = parseHTML(this.root);
        this.startApp();
        this.methods = methods;
        this.setupMethods({
          methods
        });
      }

      /* Creates a Proxy object to observe changes to state */
      createStateProxy(state) {
        const observe = (value) => {
          if (Array.isArray(value)) {
            return new Proxy(value, {
              set: (obj, prop, newValue) => {
                obj[prop] = newValue;
                this.updateElements();
                return true;
              },
              defineProperty: (obj, prop, descriptor) => {
                const result = Reflect.defineProperty(obj, prop, descriptor);
                if (prop === 'length') {
                  this.updateElements();
                }
                return result;
              },
              deleteProperty: (obj, prop) => {
                const result = Reflect.deleteProperty(obj, prop);
                this.updateElements();
                return result;
              }
            });
          } else if (typeof value === 'object' && value !== null) {
            const newObject = {};
            for (const prop in value) {
              newObject[prop] = observe(value[prop]);
            }
            return new Proxy(newObject, {
              set: (obj, prop, newValue) => {
                obj[prop] = newValue;
                this.updateElements();
                return true;
              },
              deleteProperty: (obj, prop) => {
                const result = Reflect.deleteProperty(obj, prop);
                this.updateElements();
                return result;
              }
            });
          } else {
            return value;
          }
        };

        const proxyState = observe(state);

        return proxyState;
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
        this.rootements.forEach((element, index) => {
          this.eachLoop(element, this.state, this.rootements[index])
          this.ifCondition(element, this.state, this.rootements[index])
        })
      }

      updateElements() {
        if (this.state === this.prevState) {
          return;
        }
        const elActual = document.querySelectorAll(`${this.root} *`);
        const elClone = this.cloneNode.cloneNode(true);

        Array.from(elClone.querySelectorAll('*')).forEach((element, indexElem) => {
          const targetElement = elActual[indexElem];
          if(targetElement){
            this.eachLoop(element, this.state, targetElement)
          }
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
        const elClone = this.cloneNode.cloneNode(true);
        const clickElems = document.querySelectorAll(`${this.root} *`)
        const flex = this;
        Array.from(elClone.querySelectorAll(`${this.root} *`)).forEach((elem, index) => {
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
          flex.console.warn('Instância do Flex foi criada com sucesso.', {
            debug: false
          }) // Será exibido no console com stack trace porque debug é true
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