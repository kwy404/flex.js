const ATTR_IF = "*if";

function parseIf(ifAttr){
    return ifAttr
}

/* Shows or hides an element based on the value of *if attribute */
function ifCondition(element, state, targetElement) {
  if (targetElement) {
    const ifAttr = element.getAttribute(ATTR_IF);
    if (ifAttr) {
      const condition = parseIf(ifAttr)
      const shouldShow = eval(condition);
      if(shouldShow){
        console.log(shouldShow)
        if (element.innerHTML !== targetElement.innerHTML) {
            targetElement.style.display = "";
        }
      }
    }
    Array.from(element.children).forEach((child) =>
      this.ifCondition(child, state)
    );
    if (JSON.stringify(state) !== JSON.stringify(this.state)) {
      this.state = this.createStateProxy(state);
    }
  }
}