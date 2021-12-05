# brainsjs_game
Um joguinho simples onde você joga com uma inteligência artificial treinada diretamente no seu navegador.

## Como funciona?
A inteligência artificial é feita usando o [Brain.js](https://brain.js.org/#/) que apesar de uma biblioteca um pouco limitada, consegue lidar com casos iguais aos do jogo.

### Como são passados os dados para a IA?
eles são "traduzidos" para uma matriz com números inteiros, onde cada número representa um elemento do jogo.
#### Exemplo
A ordem dos elementos é essa:
`Munição da IA, Ultima ação da IA, Munição do jogador, Ultima ação do jogador`
Imagine o seguinte cenário:
- A ia possui 2 munições e a última ação dela foi atirar.
- O jogador possui 1 munição e a última ação dele foi recarregar.
Traduzindo esses dados para a IA, seria: `[2, 1, 1, 3]`
com base nisso, ela tomaria uma decisão: `atirar`, `defender` ou `recarregar`.

## Tem sistema de dificuldade?
Ainda não tem um sistema de dificuldade, a IA é treinada igual para qualquer usuário, talvez mais futuramente alguma livraria mais poderosa como o [Tensorflow](https://www.tensorflow.org/) pode ser usada, ao invés da humildade do [Brain.js](https://brain.js.org/#/).