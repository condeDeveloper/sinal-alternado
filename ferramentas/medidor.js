#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js              todas
//   node ferramentas/medidor.js principal    A(n), formula, 2-enumeracao, permutacoes
//   node ferramentas/medidor.js maximo       o maximo de -1 e quantas o atingem
//   node ferramentas/medidor.js simetrias    espelho, meia-volta, transposta
//   node ferramentas/medidor.js duelo        forca bruta contra transferencia

import { tabelaPrincipal, maximoDeNegativos, simetrias, duelo, distribuicao } from '../src/medidas.js'

const n = (x) => (typeof x === 'bigint' ? x : BigInt(x)).toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)

function tPrincipal () {
  console.log('\n== A(n): transferencia, formula fechada e 2-enumeracao ==')
  for (const l of tabelaPrincipal(12)) {
    console.log(`   n=${pad(l.n, 2)}  A(n) ${pad(n(l.total), 26)}   formula ${l.total === l.formula ? 'bate' : 'DIVERGE'}   2-enum ${l.doisEnum === l.doisEsperado ? 'bate' : 'DIVERGE'}   permutacoes ${pad(l.porcentoPermutacao.toFixed(4), 8)}%`)
  }
  console.log('   2-enumeracao: a soma de 2^(numero de -1) sobre todas as matrizes da 2^(n(n-1)/2).')
}

function tMaximo () {
  console.log('\n== o maximo de -1 numa matriz de ordem n ==')
  for (const l of maximoDeNegativos(12)) {
    console.log(`   n=${pad(l.n, 2)}  maximo ${pad(l.max, 2)}   floor((n-1)^2/4) = ${pad(l.previsto, 2)}   ${l.max === l.previsto ? 'bate' : 'NAO BATE'}   matrizes no maximo: ${l.noMaximo}`)
  }
  console.log('   No impar o extremo e uma matriz so; no par sao duas.')
  console.log('\n   distribuicao dos -1 em n=7: ' + distribuicao(7).map(String).join(', '))
}

function tSimetrias () {
  console.log('\n== simetrias, contadas matriz por matriz ==')
  for (const l of simetrias(7)) {
    console.log(`   n=${l.n}  total ${pad(n(l.total), 7)}   espelho vertical ${pad(l.vertical, 3)}   meia-volta ${pad(l.meia, 4)}   transposta ${pad(l.transp, 5)}`)
  }
  console.log('   Espelho vertical e impossivel em ordem par: uma linha simetrica de comprimento par')
  console.log('   soma um numero par, e cada linha precisa somar 1.')
}

function tDuelo () {
  console.log('\n== forca bruta sobre 3^(n^2) matrizes contra a transferencia ==')
  for (const l of duelo()) {
    console.log(`   n=${l.n}  ${pad(n(l.testadas), 11)} matrizes testadas   bruta ${pad(l.bruta, 3)}   transferencia ${pad(n(l.transferencia), 3)}   distribuicao ${JSON.stringify(l.distBruta)} x ${JSON.stringify(l.distTransf)}   (${l.transicoes} transicoes)`)
  }
}

const partes = { principal: tPrincipal, maximo: tMaximo, simetrias: tSimetrias, duelo: tDuelo }
const pedido = process.argv[2]
if (!pedido) for (const f of Object.values(partes)) f()
else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
