// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { contaPorTransferencia, enumera, chave, espelhoVertical, meiaVolta, transposta } from './asm.js'
import { formulaFechada, doisEnumeracao, forcaBruta, permutacoes } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function contagem (n) {
  return umaVez(`c:${n}`, () => contaPorTransferencia(n))
}

/** A(n), a formula, a 2-enumeracao e as permutacoes, de 1 a `ate`. */
export function tabelaPrincipal (ate = 12) {
  return umaVez(`principal:${ate}`, () => {
    const linhas = []
    for (let n = 1; n <= ate; n++) {
      const r = contagem(n)
      const d = doisEnumeracao(r.porNegativos, n)
      const perm = permutacoes(n)
      linhas.push({
        n,
        total: r.total,
        formula: formulaFechada(n),
        doisEnum: d.soma,
        doisEsperado: d.esperado,
        permutacoes: perm,
        // Porcentagem com 4 casas, calculada em BigInt para nao perder nada.
        porcentoPermutacao: Number((perm * 1000000n) / r.total) / 10000
      })
    }
    return linhas
  })
}

/** O maximo de -1, a previsao floor((n-1)^2/4), e quantas matrizes o atingem. */
export function maximoDeNegativos (ate = 12) {
  return umaVez(`max:${ate}`, () => {
    const linhas = []
    for (let n = 1; n <= ate; n++) {
      const r = contagem(n)
      const max = r.porNegativos.length - 1
      linhas.push({ n, max, previsto: Math.floor((n - 1) * (n - 1) / 4), noMaximo: r.porNegativos[max] })
    }
    return linhas
  })
}

/** A distribuicao inteira dos -1 numa ordem. */
export function distribuicao (n) {
  return contagem(n).porNegativos
}

/** As simetrias, contadas por enumeracao de verdade (matriz por matriz). */
export function simetrias (ate = 7) {
  return umaVez(`sim:${ate}`, () => {
    const linhas = []
    for (let n = 1; n <= ate; n++) {
      let total = 0
      let vertical = 0
      let meia = 0
      let transp = 0
      enumera(n, (m) => {
        total++
        const k = chave(m)
        if (chave(espelhoVertical(m)) === k) vertical++
        if (chave(meiaVolta(m)) === k) meia++
        if (chave(transposta(m)) === k) transp++
      })
      linhas.push({ n, total, vertical, meia, transp })
    }
    return linhas
  })
}

/** A forca bruta contra a transferencia, onde ela alcanca. */
export function duelo () {
  return umaVez('duelo', () =>
    [1, 2, 3, 4].map((n) => {
      const b = forcaBruta(n)
      const r = contagem(n)
      return {
        n,
        testadas: b.testadas,
        bruta: b.achadas,
        transferencia: r.total,
        distBruta: b.porNegativos,
        distTransf: r.porNegativos.map(Number),
        transicoes: r.transicoes
      }
    })
  )
}
