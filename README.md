# Flex.js
Flex.js é uma pequena biblioteca JavaScript para atualizar automaticamente o conteúdo do DOM (Document Object Model) baseado em mudanças de estado. Ela permite que você crie elementos de UI declarativos e simplesmente ligue-os a um estado interno. Sempre que o estado é atualizado, a biblioteca atualiza automaticamente o conteúdo do DOM correspondente.

Como funciona
Flex.js usa a API de Proxy do JavaScript para rastrear mudanças de estado e atualizar o conteúdo do DOM correspondente sempre que o estado é atualizado. Ele analisa o conteúdo do DOM em busca de tokens de modelo declarativos, que correspondem a chaves de estado, e atualiza esses tokens sempre que o estado correspondente é atualizado.

Como usar
Para usar Flex.js, basta importá-lo em seu arquivo JavaScript e criar uma instância da classe Flex. Você deve passar um objeto de opções com a chave el contendo o seletor do elemento DOM que deseja observar, e a chave state contendo um objeto de estado inicial.

Por exemplo, para criar uma instância de Flex.js que observe o elemento com o ID app e um estado inicial com as chaves foo e bar:

```js

import Flex from './flex.js';

const flex = new Flex({
  el: '#app',
  state: {
    foo: 'Hello',
    bar: 'world!',
  },
});
```
Em seu HTML, você pode usar tokens de modelo declarativos, que correspondem às chaves de estado, usando a sintaxe {{key}}. Por exemplo:

```html
<div id="app">
  <h1>{{foo}} {{bar}}</h1>
  <p>{{foo}} {{bar}} is a common greeting.</p>
</div>
```