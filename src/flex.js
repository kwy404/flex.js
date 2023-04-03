class Flex {
    constructor({
        el = 'html',
        state = {},
        methods = {}
    }) {
        this.parse = new parse_();
        this.el = el;
        this.state = this.createStateProxy(state);
        this.elements = this.getNonEmptyChildElements();
        this.cloneNode = new html_parse_(this.el);
        this.start_app();
        this.methods_({
            methods
        });
    }
    
    createStateProxy(state) {
        return new Proxy(state, {
            set: (obj, prop, value) => {
                obj[prop] = value;
                this.updateElements(prop);
                return true;
            },
        });
    }
    
    getNonEmptyChildElements() {
        const elements = Array.from(document.querySelectorAll(`${this.el} *`));
        return elements.filter((element) => {
          if (element.nodeType === Node.TEXT_NODE) {
            return /\S/.test(element.textContent);
          } else {
            const childNodes = Array.from(element.childNodes);
            return childNodes.some((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                return /\S/.test(node.textContent);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                return node.childNodes.length && node.childNodes.some((child) => {
                  return child.nodeType === Node.TEXT_NODE && /\S/.test(child.textContent);
                });
              }
            });
          }
        });
      }
      
      getNonEmptyChildElementsRecursively(node) {
        const childNodes = Array.from(node.childNodes);
        return childNodes.filter((childNode) => {
          if (childNode.nodeType === Node.TEXT_NODE && /\S/.test(childNode.textContent)) {
            return true;
          } else if (childNode.nodeType === Node.ELEMENT_NODE) {
            return this.getNonEmptyChildElementsRecursively(childNode).length > 0;
          }
          return false;
        });
      }

    start_app() {
        console.log(this.elements)
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

    updateElements(prop) {
        const elActual = document.querySelectorAll(`${this.el} *`);
        const elClone = this.cloneNode.cloneNode(true);

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

    methods_({
        methods
    }) {
        const clickElems = Array.from(document.querySelectorAll(`${this.el} *`));
        const nodeOld = Array.from(document.querySelectorAll(`${this.el} > *`)); // correção aqui
        const flex = this;
        nodeOld.forEach((elem, index) => {
            const attrs = elem.attributes;
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];
                const methodName = attr.name;
                const attrMethod = methodName.replace(':', '');
                if (methodName && methodName[0] === ':') {
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