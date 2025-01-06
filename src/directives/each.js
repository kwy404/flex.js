/* Loops through elements with *each="variable in array" attribute and replaces [variable] with corresponding value in array */
function eachLoop(element, state, targetElement) {
  if (targetElement) {
    const eachAttr = element.getAttribute(ATTR_EACH);
    if (eachAttr) {
      const [itemVar, arrayVar] = eachAttr.split(' in ');
      const array = state[arrayVar];
      if (!Array.isArray(array)) return;
      element.removeAttribute(ATTR_EACH);
      const parentElement = element.parentElement;
      const cloneNode = element.cloneNode(true);
      element.innerHTML = '';
      const element_ = document.createElement(parentElement.tagName).cloneNode(true);
      array.forEach((item) => {
        const newElement = cloneNode.cloneNode(true);
        if (typeof item === 'object') {
          let innerHTML = newElement.innerHTML;
          for (const key in item) {
            if (item.hasOwnProperty(key)) {
              innerHTML = innerHTML.replace(new RegExp(`\\[\\s*${itemVar}\\.${key}\\s*\\]`, 'g'), item[key]);
            }
          }
          newElement.innerHTML = innerHTML;
        } else {
          newElement.innerHTML = newElement.innerHTML.replace(new RegExp(`\\[\\s*${itemVar}\\s*\\]`, 'g'), item);
        }
        element_.appendChild(newElement);
      });
      const tokens = parseText().text(element_.innerHTML);
      let novoHTML = element_.innerHTML;
      if (tokens) {
        tokens.forEach((token) => {
          if (token.key) {
            novoHTML = novoHTML.replaceAll(token.text, state[token.key]);
          }
        });
      }
      targetElement.innerHTML = novoHTML;
      if (element.innerHTML !== targetElement.innerHTML) {
        targetElement.innerHTML = novoHTML;
      }
      return;
    }
  }
}