/* Loops through elements with *each="variable in array" attribute and replaces [variable] with corresponding value in array */
function eachLoop(element, state, targetElement) {
    if(targetElement){
      const eachAttr = element.getAttribute(ATTR_EACH);
      if (eachAttr) {
        const [itemVar, arrayVar] = eachAttr.split(' in ');
        const array = state[arrayVar];
        if (!Array.isArray(array)) return;
        element.removeAttribute(ATTR_EACH)
        const parentElement = element.parentElement;
        const cloneNode = element.cloneNode(true);
        element.innerHTML = '';
        array.forEach((item) => {
          const newElement = cloneNode.cloneNode(true);
          newElement.innerHTML = newElement.innerHTML.replace(new RegExp(`\\[\\s*${itemVar}\\s*\\]`, 'g'), item);
          element.appendChild(newElement);
        });
        parentElement.replaceChild(element, element);
        if(element.innerHTML !== targetElement.innerHTML){
          targetElement.innerHTML = element.innerHTML;
        }
        return;
      }
      Array.from(element.children).forEach((child) => this.eachLoop(child, state));
      if (JSON.stringify(state) !== JSON.stringify(this.state)) {
        this.state = this.createStateProxy(state);
      }
    }
}