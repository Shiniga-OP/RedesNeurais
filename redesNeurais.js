// esse, é um neurônio simples:
class Neuronio {
  constructor(pesos, bias) {
    // carrega bias e pesos, se não tiver inicializa do zero
    if(pesos == null && bias == null) {
    this.pesos = [0, 0];
    this.bias = 0;
    } else {
      this.pesos = pesos;
      this.bias = bias;
    }
  }
  
 // treina o modelo 1 vez
  treino(dadosDeTreino, taxaAprendizado = 0.1) {
    for (let i = 0; i < dadosDeTreino.length; i++) {
      let entradas = dadosDeTreino[i].entradas;
      let saidaEsperada = dadosDeTreino[i].saidaEsperada;

      let soma = this.bias;
      for (let j = 0; j < entradas.length; j++) {
        soma += entradas[j] * this.pesos[j];
      }
      let saida = soma >= 0 ? 1 : 0;

      let erro = saidaEsperada - saida;

      for (let j = 0; j < this.pesos.length; j++) {
        this.pesos[j] += taxaAprendizado * erro * entradas[j];
      }
      this.bias += taxaAprendizado * erro;
    }
  }
}

// código total de como usar:
/*
function prever(entradas, pesos, bias) {
  let soma = bias;
  for (let i = 0; i < entradas.length; i++) {
    soma += entradas[i] * pesos[i];
  }
  return soma >= 0 ? 1 : 0;
}

const neo = new Neuronio();

const teste = [
  { entradas: [0, 0], saidaEsperada: 0 },
  { entradas: [0, 1], saidaEsperada: 0 },
  { entradas: [1, 0], saidaEsperada: 0 },
  { entradas: [1, 1], saidaEsperada: 1 }
];
  
neo.treino(teste);

console.log('resposta pra [0, 0]: ' + prever([0, 0], neo.pesos, neo.bias));
console.log('resposta pra [0, 1]: ' + prever([0, 1], neo.pesos, neo.bias));
console.log('resposta pra [1, 0]: ' + prever([1, 0], neo.pesos, neo.bias));
console.log('resposta pra [1, 1]: ' + prever([1, 1], neo.pesos, neo.bias)); */
////////////////////////////////////////////////////////////////////

// essa é uma rede neural simples:
class RedeNeural_PTN {
  constructor(pesos, bias) {
    // início dos pesos e bias, caso tenha um modelo pré-treinado ele pode ser carregado usando os pesos e bias dele aqui
    if(pesos == null && bias == null) {
      this.pesos = [0, 0];
      this.bias = 0;
    } else {
      this.pesos = pesos;
      this.bias = bias;
    }
  }

  ativacao(valor) {
    return valor >= 0 ? 1 : 0; // transforma as decisões em 1 e 0
  }

  treinar(dadosDeTreino, epocas = 20, taxaAprendizado = 0.1) {
    // treina o modelo pela quantidade de vezes definida pelas épocas
    for(let epoca = 0; epoca < epocas; epoca++) {
      let erroTotal = 0; // pra mostrar a taxa de erro do modelo

      for(let i = 0; i < dadosDeTreino.length; i++) {
        let entradas = dadosDeTreino[i].entradas;
        let saidaEsperada = dadosDeTreino[i].saidaEsperada;
        
        // verifica se tem a mesma quantidade de entradas e saídas
        if(entradas.length !== this.pesos.length) {
          throw new Error("Número de entradas incompatível com os pesos.");
        }
        // o cálculo principal que cuida do treino em si do modelo
        let soma = this.bias;
        for(let j = 0; j < entradas.length; j++) {
          soma += entradas[j] * this.pesos[j];
        }
        // arredonda a decisão pra 1 e 0
        let saida = this.ativacao(soma);
        
        let erro = saidaEsperada - saida;
        erroTotal += Math.abs(erro);

        // atualiza os pesos e o bias
        for(let j = 0; j < this.pesos.length; j++) {
          this.pesos[j] += taxaAprendizado * erro * entradas[j];
        }
        this.bias += taxaAprendizado * erro;
      }
      // mostra a taxa de erro a cada repetição do treino
      console.log(`Época ${epoca + 1}, Erro Total: ${erroTotal}`);
    }
  }
  
  // função pra rede neural decidir oque fazer com base nos pesos e bias
  prever(entrada) {
      let soma = this.bias;
      for (let i = 0; i < entrada.length; i++) {
        soma += entrada[i] * this.pesos[i];
    }
    // arredonda a decisão pra 1 e 0
    return this.ativacao(soma);
  }
}

// código total de como usar:
/*
const rede = new RedeNeural_PTN();
let treinamento = [
  { entradas: [0, 0], saidaEsperada: 0 },
  { entradas: [0, 1], saidaEsperada: 0 },
  { entradas: [1, 0], saidaEsperada: 0 },
  { entradas: [1, 1], saidaEsperada: 1 }
];

let resultado = rede.treinar(treinamento, 20, 0.1);

console.log("Pesos treinados:", rede.pesos);
console.log("Bias treinado:", rede.bias);

console.log("resposta pra [0, 0]:", rede.prever([0, 0]));
console.log("resposta pra [0, 1]:", rede.prever([0, 1]));
console.log("resposta pra [1, 0]:", rede.prever([1, 0]));
console.log("resposta pra [1, 1]:", rede.prever([1, 1])); */
////////////////////////////////////////////////////////////////////

// esse é um neurônio que representa uma letra:
class NeuronioTexto {
    constructor(entrada) {
        this.pesos = Array(entrada).fill(0).map(() => Math.random() * 2 - 1); // Pesos aleatórios
        this.bias = Math.random() * 2 - 1; // Bias inicial
    }

    ativacao(valor) {
        return valor > 0 ? 1 : 0; // Função de ativação degrau
    }

    prever(entradas) {
        const soma = entradas.reduce((acc, entrada, idx) => acc + entrada * this.pesos[idx], this.bias);
        return this.ativacao(soma);
    }

    treinar(entradas, saidas, taxaAprendizado = 0.01) {
        const previsao = this.prever(entradas);
        const erro = saidas - previsao;

        // Ajuste de pesos
        this.pesos = this.pesos.map((w, idx) => w + erro * entradas[idx] * taxaAprendizado);
        this.bias += erro * taxaAprendizado;

        return erro;
    }
}

class EDHv1 {
    constructor() {
      this.neuronios = [];
      this.vocabulario = [];
    }
    
    // cria o vocabulário
    criarVocabulario(vocabulario) {
      this.neuronios = vocabulario.map(() => new NeuronioTexto(vocabulario.length));
      this.vocabulario = vocabulario;
    }
    
    // Treina os neurônios por várias épocas
    treinar(dadosTreino, epocas = 100, taxaAprendizado = 0.01) {
        for (let epoca = 0; epoca < epocas; epoca++) {
            dadosTreino.forEach(data => {
                const entradaNumerica = this.textoPraVetor(data.entrada, vocabulario);
                const saidaNumerica = this.textoPraVetor(data.saida, vocabulario);
                
                this.neuronios.forEach((neuronio, idx) => {
                    neuronio.treinar(entradaNumerica, saidaNumerica[idx], taxaAprendizado);
                });
            });
        }
    }
    
    // Gera texto a partir de uma entrada
    gerarTexto(entrada) {
        const entradaNumerica = this.textoPraVetor(entrada, this.vocabulario);
        const saidaNumerica = this.neuronios.map(neuronio => neuronio.prever(entradaNumerica));
        return this.vetorPraTexto(saidaNumerica, this.vocabulario);
    }
    
    // Converte texto em vetor numérico
    textoPraVetor(texto, vocabulario) {
        const vetor = Array(vocabulario.length).fill(0);
        texto.split(" ").forEach(palavra => {
            const idx = vocabulario.indexOf(palavra);
            if (idx !== -1) vetor[idx] = 1;
        });
        return vetor;
    }
    
    // Converte vetor numérico em texto
    vetorPraTexto(vetor, vocabulario) {
        return vetor
            .map((val, idx) => (val === 1 ? vocabulario[idx] : null))
            .filter(palavra => palavra)
            .join(" ");
    }
}

// código total de como usar:
/*
const vocabulario = ["olá", "mundo", "como", "vai", "você", "tudo", "bem", "ajudar", "treinamento", "oi", "sim", "não"];

const dadosTreino = [
    { entrada: "olá mundo", saida: "como vai você" },
    { entrada: "tudo bem", saida: "ajudar treinamento" }
];

const rede = new EDHv1();

rede.criarVocabulario(vocabulario);

rede.treinar(dadosTreino);

console.log(rede.gerarTexto("olá mundo"));
console.log(rede.gerarTexto("tudo bem"));  */