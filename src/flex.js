class Flex {
    constructor({
      el = "html",
      state = {},
      methods = {}
    }) {
      this.parse = new parse_();
      this.el = el;
      this.state = new Proxy(state, {
        set: (obj, prop, value) => {
          obj[prop] = value;
          this.update_elements();
          return true;
        },
      });
      this.elClone = document.querySelector(this.el).cloneNode(true)
      this.elements = Array.from(document.querySelectorAll(`${this.el} *`)).filter(
        (element) => element.childNodes.length && /\S/.test(element.textContent)
      );
      this.cloneNode = new html_parse_(this.el);
      this.start_app();
      this.methods_({
        methods
      });
    }
  
    start_app() {
      this.elements.forEach((element, index) => {
        if (element.nodeType === Node.TEXT_NODE) {
          const tokens = this.parse.text(element.textContent);
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
              const tokens = this.parse.text(childNode.textContent);
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
  
    update_elements() {
        const elActual = document.querySelectorAll(`${this.el} *`);
        const elClone = this.elClone.cloneNode(true);
    
        Array.from(elClone.querySelectorAll('*')).forEach((element, index) => {
            const targetElement = elActual[index];
            if (element.nodeType === Node.TEXT_NODE) {
                const tokens = this.parse.text(element.textContent);
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
                        const tokens = this.parse.text(childNode.textContent);
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
    
      
    methods_({ methods }) {
        const clickElems = Array.from(document.querySelectorAll(`${this.el} *`));
        const nodeOld = Array.from(document.querySelectorAll(`${this.el} *`)); // correção aqui
        const flex = this;
        nodeOld.forEach((elem,index) => {
          const attrs = elem.attributes;
          for (let i = 0; i < attrs.length; i++) {
            const attr = attrs[i];
            const methodName = attr.name;
            const attrMethod = methodName.replace(':', '');
            if (methodName && methodName[0] === ':') {
              const methodName_ = elem.getAttribute(methodName);
              clickElems[index].addEventListener(attrMethod, function () {
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