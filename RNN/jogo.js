const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d");

// objetos:
let objeto = { 
  x: 0, vx: 0,
  angulo: 0.05, vangulo: 0
}
const player = {
  x: 0, y: 0,
  escalaX: 60, escalaY: 20
}

let gravidade = 0.002;
let tentativa = 0;
let ultimaTentativa = Date.now();

let inicioTempo = 0;
let tempo = 0;
let maiorTempo = 0;

const forcaMag = 0.005;

const rnn = new RNN();

// física
function fisica(acao){
  const forca = acao*forcaMag;
  const m_p = 0.1;
  const m_c = 1;
  const L = 0.5;
  const total = m_p+m_c;
  const sin = Math.sin(objeto.angulo);
  const cos = Math.cos(objeto.angulo);
  const temp = (forca+m_p*L*objeto.vangulo*objeto.vangulo*sin)/total;
  const anguloAcc = (gravidade*sin-cos*temp)/(L*(4/3-m_p*cos*cos/total));
  const xAcc = temp-m_p*L*anguloAcc*cos/total;
  
  objeto.vx += xAcc;
  objeto.x += objeto.vx;
  objeto.vangulo+= anguloAcc;
  objeto.angulo += objeto.vangulo;
  
  if(Math.abs(objeto.angulo)>Math.PI/2) reset();
  if(Date.now()-ultimaTentativa>30000){
    gravidade *= -1;
    ultimaTentativa = Date.now();
  }
}

// desenho
function render(info){
  ctx.clearRect(0, 0, 600, 400);
  
  player.x = 300+objeto.x*100;
  player.y = 350;
  
  ctx.fillStyle="black";
  ctx.fillRect(player.x-30, player.y, player.escalaX, player.escalaY);
  
  let ex = player.x+100*Math.sin(objeto.angulo);
  let ey = player.y-100*Math.cos(objeto.angulo);
  
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(ex, ey);
  ctx.stroke();
  
  ctx.fillStyle = "black";
  ctx.font = "14px monospace";
  
  ctx.fillStyle = info.acao==1 ? "green" : "black";
  ctx.fillRect(10, 20, 30, 30);
  ctx.fillStyle = info.acao==1 ? "black" : "green";
  ctx.fillRect(60, 20, 30, 30);
  
  ctx.fillStyle = "black";
  ctx.fillText("probabilidade: "+info.saida.toFixed(2), 10, 70);
  ctx.fillText("angulo: "+objeto.angulo.toFixed(2), 10, 90);
  ctx.fillText("tentativa: "+tentativa, 10, 110);
  ctx.fillText("tempo: "+tempo+"s", 10, 130);
  ctx.fillText("maior tempo: "+maiorTempo+"s", 10, 150);
}

// loop principal
function loop(){
  let entrada = [
    objeto.angulo, objeto.vangulo, objeto.x, objeto.vx
  ];
  let saida = rnn.propagar(entrada);
  
  tempo = Math.floor((Date.now()-inicioTempo)/1000);
  
  fisica(saida.acao);
  render(saida);
  
  // recompensa imediato: +1 enquanto equilibrado
  let recompensa = Math.abs(objeto.angulo)<Math.PI/2 ? 1 : -1;
  
  rnn.atualizar(
    recompensa, saida.grad_coef, saida.memoria, entrada
  );
  requestAnimationFrame(loop);
}

function reset(){
  objeto = {
    x:0, vx: 0,angulo: 0.05*(Math.random()>0.5 ? 1 : -1), vangulo: 0
  };
  rnn.memoria.fill(0);
  if(maiorTempo<tempo) maiorTempo = tempo;
  inicioTempo = Date.now();
  tentativa++;
}

reset();
loop();