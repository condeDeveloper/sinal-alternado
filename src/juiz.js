// O juiz. Tres caminhos que nao passam pela transferencia.
//
// 1. `formulaFechada` — A(n) = produto de (3k+1)! / (n+k)! para k de 0 a n-1.
//    Uma conta, sem busca nenhuma.
//
// 2. `doisEnumeracao` — pesando cada matriz por 2 elevado ao numero de -1, a
//    soma da exatamente 2^(n(n-1)/2). E uma afirmacao sobre a DISTRIBUICAO dos
//    -1, nao so sobre o total: a transferencia pode acertar o total e errar a
//    distribuicao, e este juiz pega.
//
// 3. `forcaBruta` — testa TODAS as 3^(n*n) matrizes de entradas 0, 1, -1 pela
//    definicao, linha e coluna. E a resposta literal, sem estado nem
//    intercalacao. Com n = 4 sao 43.046.721 matrizes, entao ela para ali — e a
//    tabela diz isso.

import { ehASM, negativos } from './asm.js'

function fatorial (k) {
  let r = 1n
  for (let i = 2n; i <= BigInt(k); i++) r *= i
  return r
}

/** A(n) pela formula fechada, em BigInt. */
export function formulaFechada (n) {
  let num = 1n
  let den = 1n
  for (let k = 0; k < n; k++) {
    num *= fatorial(3 * k + 1)
    den *= fatorial(n + k)
  }
  if (num % den !== 0n) throw new Error(`a formula nao deu inteiro em n=${n}`)
  return num / den
}

/** A soma de 2^(numero de -1) sobre a distribuicao, e o valor que ela tem de dar. */
export function doisEnumeracao (porNegativos, n) {
  let soma = 0n
  for (let k = 0; k < porNegativos.length; k++) soma += porNegativos[k] * (1n << BigInt(k))
  return { soma, esperado: 1n << BigInt(n * (n - 1) / 2) }
}

/** Todas as 3^(n^2) matrizes, testadas pela definicao. */
export function forcaBruta (n) {
  const casas = n * n
  const total = Math.pow(3, casas)
  if (total > 50_000_000) return { n, completa: false, precisaria: total }
  const m = Array.from({ length: n }, () => new Array(n).fill(0))
  let achadas = 0
  const porNeg = []
  for (let codigo = 0; codigo < total; codigo++) {
    let x = codigo
    for (let c = 0; c < casas; c++) {
      const d = x % 3
      x = (x - d) / 3
      m[(c / n) | 0][c % n] = d === 2 ? -1 : d
    }
    if (ehASM(m)) {
      achadas++
      const k = negativos(m)
      porNeg[k] = (porNeg[k] || 0) + 1
    }
  }
  return { n, completa: true, testadas: total, achadas, porNegativos: porNeg.map((v) => v || 0) }
}

/** n! — o numero de matrizes de permutacao, que sao as ASM sem -1. */
export function permutacoes (n) {
  return fatorial(n)
}
