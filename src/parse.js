/* Function to parse text and find bindings */
function parseText() {
    const BINDING_RE = /\{(.+?)\}/;
    return {
      text: function(text) {
        if (!BINDING_RE.test(text)) return null;
        let m, i, tokens = [];
        while ((m = text.match(BINDING_RE))) {
          i = m.index;
          if (i > 0) tokens.push(text.slice(0, i));
          tokens.push({
            text: m[0],
            key: m[1].trim()
          });
          text = text.slice(i + m[0].length);
        }
        if (text.length) tokens.push(text);
        return tokens;
      }
    }
}

  /* Function to parse HTML and return the first element found */
function parseHTML(html) {
    return document.querySelector(html).cloneNode(true);
}