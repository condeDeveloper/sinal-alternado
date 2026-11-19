#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js 5
//
// Conta as matrizes de ordem n, confere pela formula fechada, mostra a
// distribuicao dos -1 e imprime a primeira matriz com o maximo de -1.

import { contaPorTransferencia, formulaFechada, enumera, negativos } from '../src/index.js'

const n = Number(process.argv[2] || 5)
const r = contaPorTransferencia(n)

console.log(`ordem ${n}: ${r.total} matrizes de sinal alternado`)
console.log(`pela formula fechada: ${formulaFechada(n)}`)
console.log(`por numero de -1: ${r.porNegativos.map(String).join(', ')}`)

const maximo = r.porNegativos.length - 1
let achada = null
if (n <= 7) {
  enumera(n, (m) => { if (!achada && negativos(m) === maximo) achada = m })
  console.log(`\numa matriz com ${maximo} entradas -1:`)
  for (const linha of achada) console.log('  ' + linha.map((v) => (v === -1 ? '-' : v === 1 ? '+' : '.')).join(' '))
}
