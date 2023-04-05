const FlexInstance = (function() {
    let instance;
  
    function createInstance({
      root = 'html',
      state = {},
      methods = {}
    }) {
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
          const observe = (value) => {
            if (Array.isArray(value)) {
              return new Proxy(value, {
                set: (obj, prop, newValue) => {
                  obj[prop] = newValue;
                  this.updateElements();
                  return true;
                },
                // Adicione esse trap para observar mudanças no tamanho do array
                // e garantir que a atualização seja disparada quando um novo item é adicionado
                defineProperty: (obj, prop, descriptor) => {
                  const result = Reflect.defineProperty(obj, prop, descriptor);
                  if (prop === 'length') {
                    this.updateElements();
                  }
                  return result;
                }
              });
            } else if (typeof value === 'object' && value !== null) {
              return new Proxy(value, {
                set: (obj, prop, newValue) => {
                  obj[prop] = newValue;
                  this.updateElements();
                  return true;
                }
              });
            } else {
              return value;
            }
          };
        
          return observe(state);
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
          this.rootements.forEach(element => {
            this.eachLoop(element, this.state)
          })
        }
  
        /* Updates elements that depend on changed state properties */
        updateElements() {
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

        /* Loops through elements with *each="variable in array" attribute and replaces [variable] with corresponding value in array */
        eachLoop(element, state) {
          const eachAttr = element.getAttribute('*each');
          if (eachAttr) {
            const [itemVar, arrayVar] = eachAttr.split(' in ');
            const array = state[arrayVar];
            if (!Array.isArray(array)) return;
            element.removeAttribute('*each');
            array.forEach((item) => {
              const newElement = element.cloneNode(true);
              newElement.innerHTML = newElement.innerHTML.replace(new RegExp(`\\[\\s*${itemVar}\\s*\\]`, 'g'), item);
              element.insertAdjacentElement('beforebegin', newElement);
            });
            element.remove();
          } else {
            Array.from(element.children).forEach((child) => this.eachLoop(child, state));
          }
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
            flex.console.warn('Instância do Flex foi criada com sucesso.', {debug: false}) // Será exibido no console com stack trace porque debug é true
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