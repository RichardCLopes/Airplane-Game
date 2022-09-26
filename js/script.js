const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);

//---------IMAGES
const plane = new Image();
plane.src = "./images/planes/plane_2/plane_2_blue.png";
const hill = new Image();
hill.src = "./images/background/floor.png";
const sky = new Image();
sky.src = "./images/background/sky.png";
const itf = new Image();
itf.src = "./images/interface/panel.png";

//-------PLAYER
const player = {
  x: 0,
  y: 0,
  largura: 150,
  altura: 83,
  desenha() {
    ctx.drawImage(plane, player.x, player.y, player.largura, player.altura);
  },
};

//------FLOOR
const floor = {
  x: 0,
  y: canvas.height - 150,
  largura: canvas.width,
  altura: 150,
  desenha() {
    ctx.drawImage(hill, floor.x, floor.y, floor.largura, floor.altura);
  },
};

//------SKY
const backsky = {
  x: 0,
  y: 0,
  largura: canvas.width,
  altura: canvas.height - 40,
  desenha() {
    ctx.drawImage(sky, backsky.x, backsky.y, backsky.largura, backsky.altura);
  },
};

//------INTERFACE
const panel = {
  x: canvas.width / 2 - 250,
  y: canvas.height / 2 - 175,
  largura: 500,
  altura: 350,
  desenha() {
    ctx.drawImage(itf, panel.x, panel.y, panel.largura, panel.altura);
  },
};

let telaAtiva = {};
function mudaTela(novatela) {
  telaAtiva = novatela;
}

//------TELAS
const telas = {
  inicio: {
    desenha() {
      backsky.desenha();
      floor.desenha();
      player.desenha();
      panel.desenha();
    },
    keydown() {
      mudaTela(telas.game);
    },
    atualiza() {},
  },
};

telas.game = {
  desenha() {
    backsky.desenha();
    floor.desenha();
    player.desenha();
  },
  atualiza() {},
};

function loop() {
  telaAtiva.desenha();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", function () {
  if (telaAtiva.keydown) {
    telaAtiva.keydown();
  }
});
mudaTela(telas.inicio);
loop();
