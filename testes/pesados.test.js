// Os casos caros: a forca bruta sobre 43 milhoes de matrizes e a enumeracao
// de 218.348 matrizes uma a uma.

import test from 'node:test'
import assert from 'node:assert/strict'

import { forcaBruta } from '../src/juiz.js'
import { simetrias } from '../src/medidas.js'

test('n=4 pela forca bruta: 43.046.721 matrizes, 42 de sinal alternado', { timeout: 600000 }, () => {
  const r = forcaBruta(4)
  assert.equal(r.completa, true)
  assert.equal(r.testadas, 43046721)
  assert.equal(r.achadas, 42)
  assert.deepEqual(r.porNegativos, [24, 16, 2])
})

test('as simetrias de n=1 a 7, matriz por matriz', { timeout: 600000 }, () => {
  const s = simetrias(7)
  assert.deepEqual(s.map((l) => l.total), [1, 2, 7, 42, 429, 7436, 218348])
  assert.deepEqual(s.map((l) => l.meia), [1, 2, 3, 10, 25, 140, 588])
  assert.deepEqual(s.map((l) => l.transp), [1, 2, 5, 16, 67, 368, 2630])
})
