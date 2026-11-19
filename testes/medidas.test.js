// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabelaPrincipal, maximoDeNegativos, simetrias, distribuicao } from '../src/medidas.js'

test('A(n) de 1 a 12', () => {
  assert.deepEqual(tabelaPrincipal(12).map((l) => l.total), [
    1n, 2n, 7n, 42n, 429n, 7436n, 218348n, 10850216n, 911835460n,
    129534272700n, 31095744852375n, 12611311859677500n
  ])
})

test('formula e 2-enumeracao batem nas 12 linhas', () => {
  for (const l of tabelaPrincipal(12)) {
    assert.equal(l.total, l.formula, `n=${l.n}`)
    assert.equal(l.doisEnum, l.doisEsperado, `n=${l.n}`)
  }
})

test('A(12) passa do inteiro seguro do JavaScript', () => {
  const a12 = tabelaPrincipal(12)[11].total
  assert.ok(a12 > BigInt(Number.MAX_SAFE_INTEGER))
})

test('as permutacoes despencam: 85,71% em n=3, 2,30% em n=7, 0,0001% em n=11', () => {
  const p = tabelaPrincipal(12).map((l) => l.porcentoPermutacao)
  assert.equal(p[2], 85.7142)
  assert.equal(p[6], 2.3082)
  assert.equal(p[10], 0.0001)
  for (let i = 2; i < p.length; i++) assert.ok(p[i] < p[i - 1], `n=${i + 1}`)
})

test('o maximo de -1 e floor((n-1)^2/4) nas 12 linhas', () => {
  const l = maximoDeNegativos(12)
  assert.deepEqual(l.map((x) => x.max), [0, 0, 1, 2, 4, 6, 9, 12, 16, 20, 25, 30])
  for (const x of l) assert.equal(x.max, x.previsto, `n=${x.n}`)
})

test('o extremo e uma matriz so no impar e duas no par', () => {
  for (const x of maximoDeNegativos(12)) {
    if (x.n < 2) continue
    assert.equal(x.noMaximo, x.n % 2 === 1 ? 1n : 2n, `n=${x.n}`)
  }
})

test('a distribuicao dos -1 em n=7', () => {
  const d = distribuicao(7)
  assert.deepEqual(d, [5040n, 29400n, 63308n, 66158n, 38390n, 13037n, 2660n, 328n, 26n, 1n])
  assert.equal(d.reduce((s, v) => s + v, 0n), 218348n)
  // A moda e 3 entradas -1, nao 0: a maioria das matrizes tem -1.
  const moda = d.indexOf(d.reduce((a, b) => (a > b ? a : b)))
  assert.equal(moda, 3)
})

test('espelho vertical: zero em toda ordem par, e 1, 1, 3, 26 nas impares', () => {
  const s = simetrias(7)
  for (const l of s) if (l.n % 2 === 0) assert.equal(l.vertical, 0, `n=${l.n}`)
  assert.deepEqual(s.filter((l) => l.n % 2 === 1).map((l) => l.vertical), [1, 1, 3, 26])
})
