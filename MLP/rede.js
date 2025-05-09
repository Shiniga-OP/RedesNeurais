function sigmoid(x) {
  return 1/(1+Math.exp(-x));
}

function matriz(linhas, cols, escala=0.1) {
  let m = [];
  for(let i=0; i<linhas; i++) {
    m[i] = [];
    for(let j=0; j<cols; j++) {
      m[i][j] = (Math.random()*2-1)*escala;
    }
  }
  return m;
}

function vetor(n, escala=0.1) {
  return Array(n).fill(0).map(() => (Math.random()*2-1)*escala);
}

class MLP {
  constructor(entradas, ocultos, saidas) {
    this.entradas = entradas;
    this.ocultos = ocultos;
    this.saidas = saidas;
    this.pesosEO = matriz(ocultos, entradas, 1);
    this.pesosOS = matriz(saidas, ocultos, 1);
    this.biasO = vetor(ocultos, 1);
    this.biasS = vetor(saidas, 1);
  }
  
  copiar() {
    const rede = new MLP(this.entradas, this.ocultos, this.saidas);
    rede.pesosEO = this.pesosEO.map(r => [...r]);
    rede.pesosOS = this.pesosOS.map(r => [...r]);
    rede.biasO = [...this.biasO];
    rede.biasS = [...this.biasS];
    return rede;
  }

  mutar(taxaMutacao) {
    const f = v => v+(Math.random()*2-1)*taxaMutacao;
    this.pesosEO = this.pesosEO.map(r => r.map(f));
    this.pesosOS = this.pesosOS.map(r => r.map(f));
    this.biasO = this.biasO.map(f);
    this.biasS = this.biasS.map(f);
  }
  
  propagar(entrada) {
    const o = this.pesosEO.map((l, i) =>
      sigmoid(l.reduce((soma, peso, j) => soma+peso*entrada[j], 0)+this.biasO[i])
    );
    const s = this.pesosOS.map((l, i) =>
      sigmoid(l.reduce((soma, peso, j) => soma+peso*o[j], 0)+this.biasS[i])
    );
    return { o, s };
  }
}