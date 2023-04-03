function parse_(){
    var BINDING_RE = /\{\{(.+?)\}\}/
    return {
        text: function (text) {
            if (!BINDING_RE.test(text)) return null
            var m, i, tokens = []
            while (m = text.match(BINDING_RE)) {
                i = m.index
                if (i > 0) tokens.push(text.slice(0, i))
                tokens.push({ text: m[0], key: m[1].trim() })
                text = text.slice(i + m[0].length)
            }
            if (text.length) tokens.push(text)
            return tokens
        }
    }
}