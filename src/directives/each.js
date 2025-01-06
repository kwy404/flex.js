function eachLoop(element, state, targetElement, flex) {
  if (targetElement) {
    const eachAttr = element.getAttribute('each');
    if (eachAttr) {
      const [itemVar, arrayVar] = eachAttr.split(' in ');
      const array = state[arrayVar];
      if (!Array.isArray(array)) return;
      element.removeAttribute('each');
      const parentElement = element.parentElement;
      const cloneNode = element.cloneNode(true);
      element.innerHTML = '';
      const element_ = document.createElement(parentElement.tagName).cloneNode(true);

      array.forEach((item) => {
        const newElement = cloneNode.cloneNode(true);
        newElement.innerHTML = replacePlaceholders(newElement.innerHTML, item, itemVar);
        element_.appendChild(newElement);

        // Integrar configuração de métodos para cada item
        setupMethodsForEach(newElement, item, itemVar, state, flex);
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

// Função para configurar métodos para cada item no loop each
function setupMethodsForEach(element, item, itemVar, state, flex) {
  const clickElems = element.querySelectorAll('*');
  Array.from(clickElems).forEach((elem) => {
    const attrs = elem.attributes;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      const methodName = attr.name;
      const attrMethod = methodName.replace('@', '');
      if (methodName && methodName[0] === '@') {
        let methodCall = elem.getAttribute(methodName);
        const [methodName_, ...params] = methodCall.replace(/[()]/g, '').split(',').map(param => param.trim());
        elem.addEventListener(attrMethod, function (event) {
          if (typeof flex.methods[methodName_] === 'function') {
            const methodParams = params.map(param => {
              if (/^\d+$/.test(param)) {
                return Number(param);
              } else if (param[0] === "'" && param[param.length - 1] === "'") {
                return param.slice(1, -1);
              } else if (param === '$event') {
                return event;
              } else if (param.startsWith('[') && param.endsWith(']')) {
                // Handle parameters like [task.id]
                param = param.slice(1, -1).trim();
                return param.split('.').reduce((acc, part) => acc && acc[part], item);
              } else if (param.includes('.')) {
                return param.split('.').reduce((acc, part) => acc[part], state);
              } else {
                return state[param];
              }
            });
            flex.methods[methodName_].apply(flex, methodParams);
          }
        });
        elem.removeAttribute(methodName);
      }
    }
  });
}

// Função recursiva para substituir placeholders e lidar com objetos e arrays aninhados
function replacePlaceholders(template, data, prefix) {
  if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        if (typeof value === 'object') {
          template = replacePlaceholders(template, value, `${prefix}.${key}`);
        } else {
          template = template.replace(new RegExp(`\\[\\s*${prefix}\\.${key}\\s*\\]`, 'g'), value);
        }
      }
    }
  } else {
    template = template.replace(new RegExp(`\\[\\s*${prefix}\\s*\\]`, 'g'), data);
  }
  return template;
}