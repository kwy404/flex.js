// Flex.js - v0.0.4
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
          this.update_elements(prop);
          return true;
        },
      });
      this.elements = Array.from(document.querySelectorAll(`${this.el} *`)).filter(
        (element) => element.childNodes.length && /\S/.test(element.textContent)
      );
      this.start_app();
      this.methods_({ methods });
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
  
    update_elements(prop) {
      this.elements.forEach((element) => {
        if (element.nodeType === Node.TEXT_NODE) {
          const tokens = this.parse.text(element.textContent);
          if (tokens) {
            tokens.forEach((token) => {
              if (token.key === prop) {
                element.textContent = element.textContent.replace(
                  token.text,
                  this.state[prop]
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
                  if (token.key === prop) {
                    childNode.textContent = childNode.textContent.replace(
                      token.text,
                      this.state[prop]
                    );
                  }
                });
              }
            }
          });
        }
      });
    }

    methods_({ methods }) {
        const clickElems = Array.from(document.querySelectorAll(`${this.el} *`));
        const flex = this;
        clickElems.forEach((elem) => {
          const attrs = elem.attributes;
          for (let i = 0; i < attrs.length; i++) {
            const attr = attrs[i];
            const methodName = attr.name;
            const attrMethod = methodName.replace(':', '');
            if (methodName && methodName[0] === ':') {
              const methodName_ = elem.getAttribute(methodName);
              elem.addEventListener(attrMethod, function () {
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
  