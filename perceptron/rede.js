function degrau(x) {
  return x >= 0 ? 1 : 0;
}

class Perceptron {
  constructor(taxa=0.5) {
    this.pesos = [Math.random()*2-1, Math.random()*2-1];
    this.bias = Math.random()*2-1;
    this.taxaAprendizado = taxa;
  }
  
  prever(entrada) {
    let soma = this.bias;
    for(let i=0; i<entrada.length; i++) {
      soma += entrada[i]*this.pesos[i];
    }
    return degrau(soma);
  }
  
  treinar(entrada, saidaEsperada) {
   
        const saida = this.prever(entrada);
        
        let erro = saidaEsperada-saida;
        
        for(let i=0; i<this.pesos.length; i++) {
          this.pesos[i] += this.taxaAprendizado*erro*entrada[i];
        }
        this.bias += this.taxaAprendizado*erro;
  }
}