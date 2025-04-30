const canvas = document.getElementById("jogo");
const ctx = canvas.getContext("2d");

let player = {
  x: 150,
  y: 380,
  escalaX: 20,
  escalaY: 20
};
let bloco = {
  x: 150,
  y: 0,
  escalaX: 20,
  escalaY: 20,
  velocidade: 5
};

const rede = new Perceptron();
// leva o bloco pra cima de volta
function resetarBloco() {
  bloco.x = Math.floor(Math.random()*(canvas.width-bloco.escalaX));
  bloco.y = 0;
}
// pra detectar se encostou no bloco
function colisao(a, b) {
  return a.x<b.x+b.escalaX &&
  a.x+a.escalaX>b.x &&
  a.y<b.y+b.escalaY &&
  a.y+a.escalaY>b.y;
}

function atualizar() {
  // passando as informações das coordenadas do player em relação ao cenário e o bloco
  let entrada = [player.x/canvas.width, bloco.x/canvas.width];
  let acao = rede.prever(entrada);
  
  // decisão da rede
  if(acao==0) player.x -= 5;
  else player.x += 5;
  
  // limite de onde o player pode andar
  if(player.x<0) player.x = 0;
  if(player.x>canvas.width-player.escalaX) player.x = canvas.width-player.escalaX;
  // bloco caindo
  bloco.y += bloco.velocidade;
  // treinando a rede se ela encostar no bloco
  if(colisao(player, bloco)) {
    rede.treinar(entrada, bloco.x<player.x ? 0 : 1);
    resetarBloco();
  }

  if(bloco.y>canvas.height) {
    resetarBloco();
  }
}

// renderização:
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.escalaX, player.escalaY);
  ctx.fillStyle = "red";
  ctx.fillRect(bloco.x, bloco.y, bloco.escalaX, bloco.escalaY);
}

function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

loop();