const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

class Dino {
  constructor() {
    this.x = 50;
    this.y = 150;
    this.vy = 0;
    this.vivo = true;
    this.rede = new MLP(3, 6, 1);
    this.pontos = 0;
    this.cor = "#"+Math.floor(Math.random()*16777215).toString(16);
  }

  atualizar(obs) {
    this.vy += 1;
    this.y += this.vy;
    if(this.y>150) {
      this.y = 150;
      this.vy = 0;
    }

    let maisProx = obs.find(o => o.x+o.largura>this.x);
    if(!maisProx) return;

    let entrada = [
      (maisProx.x-this.x)/800,
      maisProx.altura/100,
      this.y/150
    ];

    let { s } = this.rede.propagar(entrada);
    if(s[0]>0.5 && this.y>=150) {
      this.vy = -15;
    }
    
    if(
      this.x+20>maisProx.x &&
      this.x<maisProx.x+maisProx.largura &&
      this.y+20>170-maisProx.altura
    ) {
      this.vivo = false;
    }

    this.pontos++;
  }

  desenhar() {
    ctx.fillStyle = this.cor;
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

class Obstaculo {
  constructor() {
    this.x = 800;
    this.largura = 20+Math.random()*20;
    this.altura = 20+Math.random()*65;
  }

  atualizar() {
    this.x -= 5;
  }

  desenhar() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, 170-this.altura, this.largura, this.altura);
  }
}

// evolução
let geracao = 0;
let populacao = [];
let obstaculos = [];
let intervalo = 0;
let redesTam = 100;

function novaGeracao() {
  populacao.sort((a, b) => b.pontos-a.pontos);
  let novos = [];
  for(let i=0; i<redesTam; i++) {
    let pai = populacao[i%5].rede.copiar();
    pai.mutar(0.1);
    let novo = new Dino();
    novo.rede = pai;
    novos.push(novo);
  }
  populacao = novos;
  obstaculos = [];
  geracao++;
}

for(let i=0; i<redesTam; i++) populacao.push(new Dino());

function loop() {
  ctx.clearRect(0, 0, 800, 200);

  if(intervalo%60==0) {
    obstaculos.push(new Obstaculo());
  }

  obstaculos.forEach(o => o.atualizar());
  obstaculos = obstaculos.filter(o => o.x+o.largura>0);

  populacao.forEach(p => {
    if(p.vivo) {
      p.atualizar(obstaculos);
      p.desenhar();
    }
  });

  obstaculos.forEach(o => o.desenhar());

  if(populacao.every(p => !p.vivo)) {
    novaGeracao();
  }

  ctx.fillStyle = "black";
  ctx.fillText("geração: "+geracao, 10, 10);

  intervalo++;
  requestAnimationFrame(loop);
}

loop();