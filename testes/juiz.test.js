import test from 'node:test'
import assert from 'node:assert/strict'

import { contaPorTransferencia } from '../src/asm.js'
import { formulaFechada, doisEnumeracao, forcaBruta, permutacoes } from '../src/juiz.js'

test('a formula fechada da 1, 2, 7, 42, 429, 7436, 218348', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7].map(formulaFechada), [1n, 2n, 7n, 42n, 429n, 7436n, 218348n])
})

test('a formula e a transferencia concordam de 1 a 10', () => {
  for (let n = 1; n <= 10; n++) assert.equal(contaPorTransferencia(n).total, formulaFechada(n), `n=${n}`)
})

test('a 2-enumeracao da 2^(n(n-1)/2) de 1 a 10', () => {
  for (let n = 1; n <= 10; n++) {
    const d = doisEnumeracao(contaPorTransferencia(n).porNegativos, n)
    assert.equal(d.soma, d.esperado, `n=${n}`)
  }
})

test('a 2-enumeracao pega distribuicao errada que o total nao pega', () => {
  // Juiz que aprova tudo nao e juiz. Troco dois termos de lugar: o total fica
  // igual, a distribuicao fica errada, e a 2-enumeracao tem de reprovar.
  const certa = contaPorTransferencia(5).porNegativos
  const torta = [...certa]
  const t = torta[1]; torta[1] = torta[2]; torta[2] = t
  assert.equal(torta.reduce((s, v) => s + v, 0n), certa.reduce((s, v) => s + v, 0n))
  const d = doisEnumeracao(torta, 5)
  assert.notEqual(d.soma, d.esperado)
})

test('a forca bruta acha 1, 2, 7 e testa 3, 81 e 19.683 matrizes', () => {
  assert.equal(forcaBruta(1).achadas, 1)
  assert.equal(forcaBruta(2).achadas, 2)
  const r = forcaBruta(3)
  assert.equal(r.testadas, 19683)
  assert.equal(r.achadas, 7)
  assert.deepEqual(r.porNegativos, [6, 1])
})

test('a forca bruta se cala onde nao alcanca', () => {
  const r = forcaBruta(5)
  assert.equal(r.completa, false)
  assert.equal(r.precisaria, Math.pow(3, 25))
})

test('as matrizes sem -1 sao exatamente as n! permutacoes', () => {
  for (let n = 1; n <= 9; n++) {
    assert.equal(contaPorTransferencia(n).porNegativos[0], permutacoes(n), `n=${n}`)
  }
})
