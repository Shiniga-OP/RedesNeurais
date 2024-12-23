// esse, é um neurônio simples:
class Neuronio {
  constructor(pesos = [], bias = 0, tamanhoEntrada, ativa = 'degrau') {
    // para rede neural recorrente
    if(tamanhoEntrada) {
      this.pesos = Array(tamanhoEntrada).fill(0).map(() => Math.random() * 2 - 1);
      this.bias = Math.random() * 2 - 1;
    } else {
      // normal
      this.pesos = pesos.length > 0 ? pesos : [Math.random(), Math.random()];
      this.bias = bias || Math.random();
    }
    // ativacao
    this.ativa = ativa;
  }
  
  // função de ativação (sigmoide)
  ativacao(valor) {
    if(this.ativa == 'degrau') {
      return valor >= 0 ? 1 : 0;
    } else if(this.ativa == 'sigmoide') {
      return 1 / (1 + Math.exp(-valor));
    }
  }
  
  // decisão do neurônio
  prever(entrada) {
    let soma = this.bias;
    
    for (let i = 0; i < entrada.length; i++) {
      soma += entrada[i] * this.pesos[i];
    }
    return this.ativacao(soma);
  }
  
 // treina o modelo 1 vez
  treinar(entradas, saidas, taxaAprendizado = 0.1) {
      let saida = this.prever(entradas);
      let erro = saidas - saida;

      for (let i = 0; i < this.pesos.length; i++) {
        this.pesos[i] += taxaAprendizado * erro * entradas[i];
      }
      this.bias += erro * taxaAprendizado;
  }
}

// código total de como usar:
/*
const neo = new Neuronio();

const teste = [
  { entrada: [0, 0], saida: 0 },
  { entrada: [0, 1], saida: 0 },
  { entrada: [1, 0], saida: 0 },
  { entrada: [1, 1], saida: 1 }
];
  
neo.treinar(teste.entrada, teste.saida);

console.log('resposta pra [0, 0]: ' + prever([0, 0]));
console.log('resposta pra [0, 1]: ' + prever([0, 1]));
console.log('resposta pra [1, 0]: ' + prever([1, 0]));
console.log('resposta pra [1, 1]: ' + prever([1, 1])); */
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
        this.pesos = Array(entrada).fill(0).map(() => Math.random() * 2 - 1);
        this.bias = Math.random() * 2 - 1;
    }
    
    // função de ativação (degrau)
    ativacao(valor) {
        return valor > 0 ? 1 : 0;
    }
    
    // decisão do neurônio
    prever(entrada) {
        let soma = this.bias;
        
        for(let i = 0; i < entrada.length; i++) {
          soma += entrada[i] * this.pesos[i];
        }
        return this.ativacao(soma);
    }
    
    // treina o neurônio
    treinar(entradas, saidas, taxaAprendizado = 0.01) {
        const previsao = this.prever(entradas);
        const erro = saidas - previsao;

        // ajusta os pesos
        for(let i =0; i < this.pesos.length; i++) {
        this.pesos[i] += taxaAprendizado * erro * entradas[i];
        }
        this.bias += erro * taxaAprendizado;

        return erro;
    }
}

class EDHv1 {
    constructor(vocabulario) {
      this.neuronios = [];
      this.vocabulario = [];
    }
    
    // cria o vocabulário
    criarVocabulario(vocabulario) {
      this.neuronios = vocabulario.map(() => new Neuronio([], 0, vocabulario.length));
      this.vocabulario = vocabulario;
    }
    
    // Treina os neurônios por várias épocas
    treinar(dadosTreino, epocas = 100, taxaAprendizado = 0.01) {
        for (let epoca = 0; epoca < epocas; epoca++) {
            dadosTreino.forEach(data => {
                const entradaNumerica = this.textoPraVetor(data.entrada, this.vocabulario);
                const saidaNumerica = this.textoPraVetor(data.saida, this.vocabulario);
                
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

////////////////////////////////////////////////////////////////////

// essa é uma camada de neurônios:
class Camada {
    constructor(tamanhoEntrada, tamanhoSaida, ativacao, vocabulario) {
        this.neuronios = Array(tamanhoSaida).fill(0).map(() => new Neuronio([], 0, tamanhoEntrada, ativacao));
        this.vocabulario = vocabulario;
    }

    // calcula a saída de todos os neurônios da camada
    prever(entradas) {
        return this.neuronios.map(neuronio => neuronio.prever(entradas));
    }
    
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

// essa é uma rede neural recorrente simples:
class RedeNeural_RNN {
    constructor(tamanhoEntrada, tamanhoOculto, tamanhoSaida) {
        this.camadaOculta = new Camada(tamanhoEntrada, tamanhoOculto, "sigmoide");
        this.camadaSaida = new Camada(tamanhoOculto, tamanhoSaida, "sigmoide");
        this.saidasOcultas = Array(tamanhoOculto).fill(0);
    }
    
    // propaga as entradas pela rede
    propagar(entradas) {
        this.saidasOcultas = this.camadaOculta.prever(entradas); // saídas da camada oculta
        return this.camadaSaida.prever(this.saidasOcultas); // saídas da camada de saída
    }

    // treina a rede usando gradiente descendente simples
    treinar(dadosTreino, epocas = 1000, taxaAprendizado = 0.1) {
      for(let epoca = 0; epoca < epocas; epoca++) {
        for(let i = 0; i < dadosTreino; i++) {
          let entradas = dadosTreino[i].entrada;
          let saidas = dadosTreino[i].saida;
          
          let saida = this.propagar(entradas);
          
          // erro simples entre a saída gerada e a esperada (só para exemplificar)
          let erros = saidas.map((esperado, i) => esperado - saida[i]);
          
          // ajuste dos pesos da camada de saída
          this.camadaSaida.neuronios.forEach((neuronio, i) => {
            neuronio.pesos = neuronio.pesos.map((peso, j) => peso + taxaAprendizado * errosSaida[i] * this.saidasOcultas[j]);
            neuronio.bias += taxaAprendizado * errosSaida[i];
          });
          
          // ajuste dos pesos da camada oculta (erros retropropagados)
          let errosOcultos = this.camadaOculta.neuronios.map((neuronio, i) => {
            let soma = 0;
            // corrigido o erro de digitação e acesso à variável neuronios
            for(let j = 0; j < this.camadaSaida.neuronios.length; j++) {
              soma += this.camadaSaida.neuronios[j].pesos[i] * erros[j];
            }
            return soma;
          });
          
          this.camadaOculta.neuronios.forEach((neuronio, i) => {
            neuronio.pesos = neuronio.pesos.map((peso, j) => peso + taxaAprendizado * errosOcultos[i] * entradas[j]);
            neuronio.bias += taxaAprendizado * errosOcultos[i];
          });
        }
      }
    }
}

// código total de como usar:
/*
const entradas = [0.5, 0.2];
const saidas = [0.8];

// Inicializando a rede neural
const rede = new RedeNeural_RNN(entradas.length, 3, saidas.length);

// Treinando a rede por algumas iterações
    rede.treinar(entradas, saidas, 1000);

console.log("Saídas geradas:", rede.propagar(entradas)); */

////////////////////////////////////////////////////////////////////

class EDHv2 {
    constructor(tamanhoEntrada, tamanhoOculto, tamanhoSaida) {
        this.camadaOculta = new Camada(tamanhoEntrada, tamanhoOculto, "degrau");
        this.camadaSaida = new Camada(tamanhoOculto, tamanhoSaida, "degrau");
        this.saidasOcultas = Array(tamanhoOculto).fill(0);
    }
    
    // propaga as entradas pela rede
    propagar(entradas) {
        this.saidasOcultas = this.camadaOculta.prever(entradas); // saídas da camada oculta
        return this.camadaSaida.prever(this.saidasOcultas); // saídas da camada de saída
    }

    // treina a rede usando gradiente descendente simples
    treinar(dadosTreino, epocas = 1000, taxaAprendizado = 0.1) {
      for(let epoca = 0; epoca < epocas; epoca++) {
        for(let i = 0; i < dadosTreino; i++) {
          let entradas = dadosTreino[i].entrada;
          let saidas = dadosTreino[i].saida;
          
          let saida = this.propagar(entradas);
          
          // erro simples entre a saída gerada e a esperada (só para exemplificar)
          let erros = saidas.map((esperado, i) => esperado - saida[i]);
          
          // ajuste dos pesos da camada de saída
          this.camadaSaida.neuronios.forEach((neuronio, i) => {
            neuronio.pesos = neuronio.pesos.map((peso, j) => peso + taxaAprendizado * errosSaida[i] * this.saidasOcultas[j]);
            neuronio.bias += taxaAprendizado * errosSaida[i];
          });
          
          // ajuste dos pesos da camada oculta (erros retropropagados)
          let errosOcultos = this.camadaOculta.neuronios.map((neuronio, i) => {
            let soma = 0;
            // corrigido o erro de digitação e acesso à variável neuronios
            for(let j = 0; j < this.camadaSaida.neuronios.length; j++) {
              soma += this.camadaSaida.neuronios[j].pesos[i] * erros[j];
            }
            return soma;
          });
          
          this.camadaOculta.neuronios.forEach((neuronio, i) => {
            neuronio.pesos = neuronio.pesos.map((peso, j) => peso + taxaAprendizado * errosOcultos[i] * entradas[j]);
            neuronio.bias += taxaAprendizado * errosOcultos[i];
          });
        }
      }
    }
}

// código total de como usar:
/*
const treino = [
  { entrada: "olá", saida: "oi" },
  { entrada: "tudo bem?", saida: "tudo" },
  { entrada: "oi", saida: "olá" }
];

// Inicializando o vocabulário
const vocab = ["oi", "olá", "tudo", "bem", "?"];

// Inicializando a rede neural
const rede = new EDHv2(vocab.length, 5, vocab.length); // 5 neurônios na camada oculta

// Convertendo os dados de treino
const dadosTreino = treino.map(({ entrada, saida }) => ({
  entrada: rede.camadaOculta.textoPraVetor(entrada, vocab),
  saida: rede.camadaOculta.textoPraVetor(saida, vocab)
}));

// Treinando a rede
rede.treinar(dadosTreino, 1000, 0.001);

// Testando a rede
const entrada = "olá";
const entradaVetorizada = rede.camadaOculta.textoPraVetor(entrada, vocab);
const saidaVetorizada = rede.propagar(entradaVetorizada);

// Convertendo a saída para texto
const saidaTexto = rede.camadaSaida.vetorPraTexto(saidaVetorizada, vocab);
console.log(`pergunta: "${entrada}", resposta: "${saidaTexto}"`); */