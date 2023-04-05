# Flex - Singleton Implementation
Esta é uma implementação JavaScript de um objeto singleton que vincula dados a elementos no DOM usando uma sintaxe simples.

Como funciona O objeto FlexInstance cria um objeto Flex que manipula a vinculação de dados aos elementos no DOM. O objeto Flex é criado usando uma função createInstance que recebe um objeto de opções com as seguintes propriedades:

el: o seletor para o elemento raiz ao qual os dados devem ser vinculados (o padrão é 'html'). state: um objeto contendo o estado inicial da aplicação. métodos: um objeto contendo métodos que podem ser chamados por ligações no DOM. O objeto Flex usa duas funções auxiliares:

parseText: uma função que analisa o texto e encontra ligações usando a sintaxe {variableName}. parseHTML: uma função que analisa o HTML e retorna o primeiro elemento encontrado. O objeto Flex cria um objeto proxy para observar as alterações no estado e encontra elementos no DOM e vincula dados a eles usando o método startApp. O método updateElements atualiza os elementos que dependem das propriedades de estado alteradas. O método setupMethods configura métodos no objeto Flex que podem ser chamados por ligações no DOM.

Como usar Para usar o FlexInstance, basta criar um objeto Flex usando o método getInstance do singleton FlexInstance. Você pode usar as propriedades de estado e métodos do objeto Flex para vincular dados e criar métodos para seu aplicativo.

Aqui está um exemplo de uso:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Flex.js Example</title>
  </head>
  <body>
    <div id="app">
      <p>Count: { count }</p>
      <button @click="increment">Increment</button>
      <h1>{message}</h1>
    </div>

    <script src="../build/flex.min.js"></script>
    <script>
      const myApp = FlexInstance.create({
        root: '#app',
        state: {
          count: 0,
          message: "Message"
        },
        methods: {
          increment() {
            this.state.count++
          }
        }
      }).getInstance();

      myApp.state.message = 'I love ❤️ Flex'; 

    </script>
  </body>
</html> 
```
License
This implementation is licensed under the MIT license.