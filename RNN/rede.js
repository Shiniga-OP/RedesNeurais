function sigmoid(x){
  return 1/(1+Math.exp(-x));
}

function matriz(linhas, colunas) {
  return Array.from({ length: linhas }).map(() => vetor(colunas));
}

function vetor(n, escala=0.1) {
  return Array(n).fill(0).map(() => (Math.random()*2-1)*escala);
}

function zeros(n) {
  return Array(n).fill(0);
}

class RNN {
  constructor(entradaTam=4, ocultaTam=4, taxaAprendizado=0.0005) {
    this.entradaTam = entradaTam
    this.ocultaTam = ocultaTam;
    this.pEntrada = matriz(ocultaTam, entradaTam);
    this.pOculta = vetor(ocultaTam);
    this.pSaida = vetor(ocultaTam);
    
    this.bSaida = 0;
    this.memoria = zeros(ocultaTam);
    
    this.taxaAprendizado = taxaAprendizado;
  }
  
  propagar(entrada){
    for(let i=0; i<this.ocultaTam; i++) {
      let soma = 0;
      for(let j=0; j<this.entradaTam; j++) {
        soma += entrada[j]*this.pEntrada[i][j];
      }
      soma += this.memoria[i]*this.pOculta[i];
      this.memoria[i] = sigmoid(soma);
    }
    
    // compute policy
    let saida_crua = this.memoria.reduce((s, o, i) => s+o*this.pSaida[i], this.bSaida);
    
    let saida = sigmoid(saida_crua);
    // 1 = direita, -1 = esquerda
    let acao = (Math.random()<saida ? 1 : -1);
    
    // gradiente dlogπ/dPSaida = (acao==1?1-saida : -saida)*memoria
    let grad_coef = (acao==1 ? 1-saida : -saida);
    return {
      acao,
      saida,
      grad_coef,
      memoria: this.memoria.slice()
    };
  }
  // policy gradiant
  atualizar(recompensa, grad_coef, memoria, entrada){
    for(let i=0; i<this.ocultaTam; i++) {
      this.pSaida[i] += this.taxaAprendizado*recompensa*grad_coef*memoria[i];
      for(let j=0; j<this.entradaTam; j++) {
        this.pEntrada[i][j] += this.taxaAprendizado*recompensa*grad_coef*entrada[j];
      }
      this.pOculta[i] += this.taxaAprendizado*recompensa*grad_coef*memoria[i];
    }
    this.bSaida += this.taxaAprendizado*recompensa*grad_coef;
  }
}
