// Flex.js - v0.0.4
class Flex {
    constructor({
      el = "html",
      state = {}
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
    }
  
    start_app() {
      this.elements.forEach((element, index) => {
        if (element.nodeType === Node.TEXT_NODE) {
          const tokens = this.parse.text(element.textContent);
          if (tokens) {
            tokens.forEach((token) => {
              if (token.key) {
                element.textContent = this.state[token.key] ? this.state[token.key] : 'undefined'
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
                    childNode.textContent = this.state[token.key] ? this.state[token.key] : 'undefined'
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
  }
  