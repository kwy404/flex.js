const ATTR_IF = "*if";

function parseIf(ifAttr, state) {
  // Create a new function that takes the state as an argument and returns the condition evaluation
  try {
    return new Function('state', `with(state) { return ${ifAttr}; }`)(state);
  } catch (e) {
    console.error(`Error evaluating condition: ${ifAttr}`, e);
    return false;
  }
}

/* Shows or hides an element based on the value of *if attribute */
function ifCondition(element, state, targetElement) {
  if (targetElement) {
    const ifAttr = element.getAttribute(ATTR_IF);
    if (ifAttr) {
      const shouldShow = parseIf(ifAttr, state);
      if (shouldShow) {
        targetElement.style.display = "block";
      } else {
        targetElement.style.display = "none";
      }
    }
    Array.from(element.children).forEach((child) =>
      this.ifCondition(child, state, targetElement.querySelector(child.tagName))
    );
    if (JSON.stringify(state) !== JSON.stringify(this.state)) {
      this.state = this.createStateProxy(state);
    }
  }
}