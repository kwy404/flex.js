# FlexInstance
O FlexInstance é um módulo JavaScript que define uma classe Flex e um método getInstance para criar uma instância única da classe. A instância da classe Flex é um objeto que lida com a atualização de dados e interação com o DOM (Document Object Model) de um elemento HTML.

# Flex
A classe Flex tem os seguintes métodos:

# Constructor
O construtor da classe recebe um objeto com as seguintes propriedades:

`root`: O seletor CSS para o elemento raiz do DOM. Por padrão, é definido como 'html'.
`state`: Um objeto que contém o estado inicial do aplicativo. Cada propriedade deste objeto é uma chave que representa o nome da variável e o valor é o valor `inicial`. Este estado é mantido em um objeto Proxy para observar mudanças nas propriedades.
`methods`: Um objeto que contém métodos que podem ser chamados a partir do DOM em resposta a eventos de usuário, como cliques em botões. Cada propriedade deste `objeto` é uma chave que representa o nome do método e o valor é uma função.
`createStateProxy`
Este método cria um objeto Proxy que é usado para observar mudanças nas propriedades do estado. Quando uma propriedade é atualizada, todos os elementos no DOM que dependem dessa propriedade serão atualizados automaticamente.

# startApp
Este método encontra todos os elementos no DOM que têm ligações de dados com o estado e atualiza seu conteúdo. As ligações de dados são encontradas no conteúdo de texto desses elementos, por meio de uma expressão regular que procura por chaves entre chaves ({...}). Quando uma chave é encontrada, seu valor correspondente é procurado no objeto de estado e substituído na string original.

# updateElements
Este método é chamado quando uma propriedade do estado é atualizada. Ele encontra todos os elementos no DOM que dependem dessa propriedade e atualiza seu conteúdo. Ele funciona da mesma forma que o método startApp, mas é usado para atualizar apenas os elementos afetados por uma mudança de estado específica.

# setupMethods
Este método é usado para configurar a interação do usuário com o aplicativo. Ele encontra todos os elementos no DOM que têm atributos que começam com o caractere "@" e adiciona um ouvinte de evento para cada um deles. Quando o evento ocorre, o método correspondente é chamado no objeto methods especificado.

# getInstance
O método getInstance é usado para criar uma instância única da classe Flex. Se uma instância já foi criada, ele retorna essa instância em vez de criar uma nova. Isso garante que haja apenas uma instância do objeto Flex para todo o aplicativo.

O método create é exposto publicamente para permitir a criação de instâncias separadas do objeto Flex, se necessário. Ele recebe um objeto com as mesmas propriedades do construtor da classe Flex.

# Observações
O código faz uso de vários recursos do JavaScript moderno, como let, const, arrow functions, destructuring, spread syntax, classes, Proxies, e Template literals. O código é projetado para trabalhar com aplicativos baseados em HTML, e faz uso de métodos e propriedades do DOM do navegador para localizar e manipular elementos