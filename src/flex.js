class Flex {
    constructor({
        el = 'html',
        state = {},
        methods = {}
    }) {
        this.parse = new parse_();
        this.el = el;
        this.state = this.createStateProxy(state);
        this.elements = Array.from(document.querySelectorAll(`${this.el} *`)).filter(
            (element) => element.childNodes.length && /\S/.test(element.textContent)
        );
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

    methods_({ methods }) {
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
      
        const elemsWithEach = Array.from(document.querySelectorAll(`${this.el} [f-each]`));
      
        elemsWithEach.forEach((elem) => {
          const [item, collection] = elem.getAttribute('f-each').split(' in ');
          const collectionArray = flex.state[collection];
          if (collectionArray) {
            const fragment = document.createDocumentFragment();
            collectionArray.forEach((data, index) => {
              const clone = elem.cloneNode(true);
              clone.removeAttribute('f-each');
              const innerElem = clone.querySelector('*');
              if (innerElem) {
                innerElem.textContent = data[item];
              }
              clone.textContent = collectionArray[index]
              fragment.appendChild(clone);
            });
            elem.parentNode.replaceChild(fragment, elem);
          }
        });
      
        const textElems = Array.from(document.querySelectorAll(`${this.el} *[f-text]`));
        textElems.forEach((elem) => {
          const textKey = elem.getAttribute('f-text');
          elem.textContent = flex.state[textKey];
        });
      }      
}