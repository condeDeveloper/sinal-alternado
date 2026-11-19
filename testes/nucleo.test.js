import test from 'node:test'
import assert from 'node:assert/strict'

import {
  linhaValida, ehASM, negativos, transicaoValida, contaPorTransferencia,
  enumera, ehPermutacao, transposta, espelhoVertical, meiaVolta, chave, bits
} from '../src/asm.js'

test('linha valida: alterna comecando e terminando em +1, e soma 1', () => {
  assert.equal(linhaValida([0, 1, 0]), true)
  assert.equal(linhaValida([1, -1, 1]), true)
  assert.equal(linhaValida([1, 0, -1, 0, 1]), true)
})

test('linha invalida: comeca em -1, termina em -1, repete sinal ou e vazia', () => {
  assert.equal(linhaValida([-1, 1, 1]), false)
  assert.equal(linhaValida([1, -1]), false)
  assert.equal(linhaValida([1, 1, -1]), false)
  assert.equal(linhaValida([0, 0, 0]), false)
})

test('a menor matriz com -1 e a de 3x3 com o -1 no centro', () => {
  const m = [[0, 1, 0], [1, -1, 1], [0, 1, 0]]
  assert.equal(ehASM(m), true)
  assert.equal(negativos(m), 1)
  assert.equal(ehPermutacao(m), false)
})

test('toda matriz de permutacao e de sinal alternado', () => {
  assert.equal(ehASM([[0, 1, 0], [0, 0, 1], [1, 0, 0]]), true)
  assert.equal(ehPermutacao([[0, 1, 0], [0, 0, 1], [1, 0, 0]]), true)
})

test('coluna invalida derruba a matriz mesmo com as linhas certas', () => {
  // As tres linhas sao validas, mas a coluna do meio fica 1, 1, 0: soma 2.
  assert.equal(ehASM([[0, 1, 0], [0, 1, 0], [1, 0, 0]]), false)
})

test('a transicao de estados e valida exatamente quando a linha alterna', () => {
  // De {coluna 1} para {0, 2}: a linha e +1, -1, +1.
  assert.equal(transicaoValida(0b010, 0b101, 3), true)
  // De {0} para {1, 2}: a linha e -1, +1, +1 — comeca em -1.
  assert.equal(transicaoValida(0b001, 0b110, 3), false)
})

test('a contagem por transferencia da 1, 2, 7, 42, 429', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map((n) => contaPorTransferencia(n).total), [1n, 2n, 7n, 42n, 429n])
})

test('a enumeracao matriz por matriz conta o mesmo que a transferencia', () => {
  for (let n = 1; n <= 6; n++) {
    assert.equal(BigInt(enumera(n)), contaPorTransferencia(n).total, `n=${n}`)
  }
})

test('toda matriz que a enumeracao entrega passa na definicao', () => {
  let ruins = 0
  enumera(5, (m) => { if (!ehASM(m)) ruins++ })
  assert.equal(ruins, 0)
})

test('a enumeracao entrega copias, nao o vetor de trabalho', () => {
  const guardadas = []
  enumera(3, (m) => guardadas.push(m))
  assert.equal(guardadas.length, 7)
  assert.equal(new Set(guardadas.map(chave)).size, 7)
})

test('a distribuicao dos -1 soma o total', () => {
  for (let n = 1; n <= 8; n++) {
    const r = contaPorTransferencia(n)
    assert.equal(r.porNegativos.reduce((s, v) => s + v, 0n), r.total)
  }
})

test('as simetrias levam matriz valida em matriz valida', () => {
  const m = [[0, 1, 0, 0], [1, -1, 1, 0], [0, 1, -1, 1], [0, 0, 1, 0]]
  assert.equal(ehASM(m), true)
  for (const f of [transposta, espelhoVertical, meiaVolta]) assert.equal(ehASM(f(m)), true)
})

test('contar bits bate com a contagem no braco', () => {
  for (const x of [0, 1, 7, 255, 0b10110]) {
    let c = 0
    for (let i = 0; i < 31; i++) if (x & (1 << i)) c++
    assert.equal(bits(x), c)
  }
})
