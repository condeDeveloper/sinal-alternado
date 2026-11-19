// Matrizes de sinal alternado.
//
// Uma matriz n x n de entradas 0, 1 e -1 e de SINAL ALTERNADO quando, em cada
// linha e em cada coluna:
//
//   - a soma e 1;
//   - os nao-zeros alternam de sinal, comecando e terminando em +1.
//
// Toda matriz de permutacao e uma delas (um +1 por linha, sem -1 nenhum). As
// outras sao as que tem algum -1 — a de 3x3 com o -1 no centro e a menor.
//
// A contagem nao precisa montar as matrizes. Lendo a matriz de cima para baixo,
// a SOMA PARCIAL de cada coluna e sempre 0 ou 1 (porque os nao-zeros da coluna
// alternam comecando em +1). Entao o estado depois de k linhas e um conjunto de
// colunas "ligadas", com exatamente k elementos, e a linha seguinte e a
// diferenca entre dois estados. A linha e valida exatamente quando os dois
// conjuntos se INTERCALAM — e e so isso que a transferencia precisa saber.

/** A linha alterna de sinal, comecando e terminando em +1, e soma 1? */
export function linhaValida (x) {
  let esperado = 1
  let soma = 0
  let algum = false
  for (const v of x) {
    if (v === 0) continue
    if (v !== esperado) return false
    soma += v
    esperado = -esperado
    algum = true
  }
  return algum && soma === 1 && esperado === -1
}

/** A matriz inteira e de sinal alternado? Linhas e colunas. */
export function ehASM (m) {
  const n = m.length
  for (const linha of m) if (linha.length !== n || !linhaValida(linha)) return false
  for (let j = 0; j < n; j++) {
    const coluna = []
    for (let i = 0; i < n; i++) coluna.push(m[i][j])
    if (!linhaValida(coluna)) return false
  }
  return true
}

/** Quantos -1 a matriz tem. */
export function negativos (m) {
  let c = 0
  for (const l of m) for (const v of l) if (v === -1) c++
  return c
}

export function bits (x) {
  let c = 0
  while (x) { x &= x - 1; c++ }
  return c
}

/**
 * A transicao de um estado `a` (k colunas ligadas) para `b` (k+1 ligadas) e
 * uma linha valida? A linha e b - a: +1 onde so b liga, -1 onde so a liga.
 * Lendo da esquerda para a direita, os sinais tem de alternar +,-,+,...,+.
 */
export function transicaoValida (a, b, n) {
  let esperado = 1
  for (let j = 0; j < n; j++) {
    const ea = (a >> j) & 1
    const eb = (b >> j) & 1
    if (ea === eb) continue
    const v = eb - ea
    if (v !== esperado) return false
    esperado = -esperado
  }
  return esperado === -1
}

/**
 * Conta as matrizes de ordem n pela transferencia, separando pelo numero de -1.
 *
 * Devolve `porNegativos[k]` = quantas matrizes tem exatamente k entradas -1, em
 * BigInt: A(12) ja passa de 2^53, e um numero que estoura nao da erro, da tabela
 * errada com cara de certa.
 */
export function contaPorTransferencia (n) {
  const tam = 1 << n
  // Para cada estado, um polinomio no numero de -1 (vetor de BigInt).
  let atual = new Map([[0, [1n]]])
  let transicoes = 0
  for (let linha = 0; linha < n; linha++) {
    const proximo = new Map()
    for (const [a, poli] of atual) {
      for (let b = 0; b < tam; b++) {
        if (bits(b) !== linha + 1) continue
        if (!transicaoValida(a, b, n)) continue
        transicoes++
        // Os -1 desta linha sao as colunas que estavam ligadas e desligam.
        const neg = bits(a & ~b)
        const destino = proximo.get(b) || []
        for (let k = 0; k < poli.length; k++) {
          if (!poli[k]) continue
          const i = k + neg
          while (destino.length <= i) destino.push(0n)
          destino[i] += poli[k]
        }
        proximo.set(b, destino)
      }
    }
    atual = proximo
  }
  const final = atual.get(tam - 1) || [0n]
  const total = final.reduce((s, v) => s + v, 0n)
  return { n, total, porNegativos: final, transicoes }
}

/**
 * Enumera as matrizes uma a uma, linha a linha, montando cada uma de verdade.
 *
 * `visita` recebe cada matriz pronta. A matriz entregue e uma COPIA: devolver o
 * vetor de trabalho funciona dentro do laco e mente quando alguem guarda a lista.
 */
export function enumera (n, visita) {
  const tam = 1 << n
  const m = []
  let quantas = 0
  const desce = (estado, linha) => {
    if (linha === n) {
      if (estado === tam - 1) { quantas++; if (visita) visita(m.map((l) => [...l])) }
      return
    }
    for (let b = 0; b < tam; b++) {
      if (bits(b) !== linha + 1) continue
      if (!transicaoValida(estado, b, n)) continue
      const row = []
      for (let j = 0; j < n; j++) row.push(((b >> j) & 1) - ((estado >> j) & 1))
      m.push(row)
      desce(b, linha + 1)
      m.pop()
    }
  }
  desce(0, 0)
  return quantas
}

/** Matriz de permutacao? (sem -1, um 1 por linha e coluna) */
export function ehPermutacao (m) {
  return negativos(m) === 0
}

/** A matriz transposta, girada e espelhada: as simetrias do quadrado. */
export function transposta (m) { return m[0].map((_, j) => m.map((l) => l[j])) }
export function espelhoVertical (m) { return m.map((l) => [...l].reverse()) }
export function meiaVolta (m) { return [...m].reverse().map((l) => [...l].reverse()) }

export function chave (m) { return m.map((l) => l.join(',')).join(';') }
