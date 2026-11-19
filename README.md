# Matrizes de sinal alternado

Matrizes de sinal alternado contadas por transferência e enumeradas uma a uma, em Node puro, sem dependência nenhuma.

Uma matriz n × n de entradas 0, +1 e −1 é **de sinal alternado** quando, em cada linha e em cada coluna, a soma é 1 e os não-zeros alternam de sinal, começando e terminando em +1. Toda matriz de permutação é uma delas. As outras têm algum −1 — e a de ordem 7 com o maior número de −1 possível é esta, a única:

```
. . . + . . .
. . + - + . .
. + - + - + .
+ - + - + - +
. + - + - + .
. . + - + . .
. . . + . . .
```

---

## Os quatro achados

**1. O máximo de −1 é `⌊(n−1)²/4⌋`, medido em doze ordens.** A coluna sai 0, 0, 1, 2, 4, 6, 9, 12, 16, 20, 25, 30 para n de 1 a 12, e bate com a fórmula em todas as linhas.

**2. O extremo é uma matriz só no ímpar e duas no par.** Em toda ordem de 3 a 12, a quantidade de matrizes com o máximo de −1 alterna 1, 2, 1, 2… Na ímpar é o losango em xadrez acima; na par são duas, uma o espelho da outra.

**3. Matriz de permutação vira exceção muito rápido.** São 85,71% das matrizes de sinal alternado em n=3, 2,30% em n=7 e 0,0001% em n=11. Em n=7 a moda nem é zero: o número de −1 mais comum é **3**, com 66.158 matrizes.

**4. Espelho vertical é impossível em ordem par.** Contando matriz por matriz até n=7, as simétricas pelo espelho vertical são 1, 1, 3, 26 nas ordens ímpares e **zero** em todas as pares. O motivo é curto: uma linha simétrica de comprimento par soma um número par, e cada linha precisa somar 1.

---

## Como a contagem funciona

Não é preciso montar as matrizes para contá-las. Lendo de cima para baixo, a **soma parcial de cada coluna é sempre 0 ou 1** — porque os não-zeros da coluna alternam começando em +1. Então o estado depois de k linhas é um conjunto de k colunas "ligadas", e a linha seguinte é a diferença entre dois estados. A linha é válida exatamente quando os sinais da diferença alternam.

A transferência carrega, para cada estado, um polinômio no número de −1. É isso que dá a distribuição inteira, e não só o total.

`A(12)` passa de 2⁵³ — o inteiro seguro do JavaScript. Tudo é contado em `BigInt`, porque número que estoura não dá erro: dá tabela errada com cara de certa.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

| n | A(n) | % de permutações | máximo de −1 | matrizes no máximo |
| --- | --- | --- | --- | --- |
| 1 | 1 | 100,0000 | 0 | 1 |
| 2 | 2 | 100,0000 | 0 | 2 |
| 3 | 7 | 85,7142 | 1 | 1 |
| 4 | 42 | 57,1428 | 2 | 2 |
| 5 | 429 | 27,9720 | 4 | 1 |
| 6 | 7.436 | 9,6826 | 6 | 2 |
| 7 | 218.348 | 2,3082 | 9 | 1 |
| 8 | 10.850.216 | 0,3716 | 12 | 2 |
| 9 | 911.835.460 | 0,0397 | 16 | 1 |
| 10 | 129.534.272.700 | 0,0028 | 20 | 2 |
| 11 | 31.095.744.852.375 | 0,0001 | 25 | 1 |
| 12 | 12.611.311.859.677.500 | 0,0000 | 30 | 2 |

As porcentagens são truncadas na quarta casa, calculadas em `BigInt`.

### A distribuição dos −1 em n = 7

| −1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| matrizes | 5.040 | 29.400 | 63.308 | **66.158** | 38.390 | 13.037 | 2.660 | 328 | 26 | 1 |

### As simetrias, contadas matriz por matriz

| n | total | espelho vertical | meia-volta | transposta |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 2 | **0** | 2 | 2 |
| 3 | 7 | 1 | 3 | 5 |
| 4 | 42 | **0** | 10 | 16 |
| 5 | 429 | 3 | 25 | 67 |
| 6 | 7.436 | **0** | 140 | 368 |
| 7 | 218.348 | 26 | 588 | 2.630 |

---

## Os três juízes

**A fórmula fechada** — `A(n) = ∏ (3k+1)! / (n+k)!` para k de 0 a n−1 — confere o total nas doze ordens, sem buscar nada.

**A 2-enumeração** confere a *distribuição*: pesando cada matriz por 2 elevado ao seu número de −1, a soma tem de dar exatamente `2^(n(n−1)/2)`. A transferência poderia acertar o total e errar a distribuição; este juiz pega. E ele tem controle negativo: trocando dois termos da distribuição de lugar, o total fica igual e a 2-enumeração reprova.

**A força bruta** testa todas as `3^(n²)` matrizes pela definição, linha e coluna, sem estado nem intercalação. Vai até n=4 — 43.046.721 matrizes, 42 achadas, distribuição 24, 16, 2 — e a tabela diz isso em vez de fingir que conferiu mais.

E as matrizes sem −1 são conferidas contra `n!` de 1 a 9.

---

## O que as medidas me corrigiram

**Achei que matriz de permutação fosse a regra, e −1 a exceção.** Em n=7 elas são 2,3%, e a moda da distribuição é 3 entradas −1. A exceção é ter zero.

**Esperava que o extremo fosse único sempre.** Em ordem par são **duas** matrizes no máximo, não uma — e a coluna alterna 1, 2, 1, 2 em todas as dez linhas de 3 a 12. Fui olhar a de n=4 achando que era bug de contagem; são as duas metades espelhadas do losango, que no par não fecha no centro.

**Quase confiei no total.** A primeira conferência era só contra a fórmula fechada, que olha o total. A transferência carrega o número de −1 em cada estado, e um erro nessa conta passaria intacto. A 2-enumeração entrou para conferir a distribuição, e entrou com controle negativo, porque juiz que nunca reprova não está medindo nada.

**Tentei a força bruta em n=5.** São 3²⁵, mais de 847 bilhões de matrizes. A função se recusa acima de 50 milhões e devolve quanto precisaria, em vez de travar a suíte.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test                               # a suite inteira
npm run medir                          # todas as tabelas
node ferramentas/medidor.js maximo     # o maximo de -1 e o extremo
node exemplos/uso.js 7                 # conta, confere e desenha o extremo
```

```js
import { contaPorTransferencia, formulaFechada } from 'sinal-alternado'

contaPorTransferencia(7).total      // 218348n
contaPorTransferencia(7).porNegativos  // [5040n, 29400n, ..., 26n, 1n]
formulaFechada(12)                  // 12611311859677500n
```

## Os arquivos

- `src/asm.js` — a definição, a transferência e a enumeração.
- `src/juiz.js` — a fórmula fechada, a 2-enumeração e a força bruta.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 30 testes, com os números do README presos.

## Licença

MIT.
