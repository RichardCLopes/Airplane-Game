const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const globais = {};

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
function criaPlayer() {
  const player = {
    x: 50,
    y: (canvas.height - 250) / 2,
    largura: 200,
    altura: 110,
    fly(num) {
      if (num == 1 && player.y > 50) {
        player.y -= 5;
      } else if (num == 2 && player.y < canvas.height - 300) {
        player.y += 5;
      }
    },
    desenha() {
      ctx.drawImage(plane, player.x, player.y, player.largura, player.altura);
    },
  };
  return player;
}

//------FLOOR
function moveFloor() {
  const floor = {
    x: 0,
    y: canvas.height - 150,
    largura: canvas.width,
    altura: 150,
    atualiza() {
      const movimentofloor = 2;
      const repete = floor.largura;
      const movimento = floor.x - movimentofloor;
      floor.x = movimento % repete;
    },
    desenha() {
      ctx.drawImage(hill, floor.x, floor.y, floor.largura, floor.altura);
      ctx.drawImage(
        hill,
        floor.x + floor.largura,
        floor.y,
        floor.largura,
        floor.altura
      );
    },
  };
  return floor;
}

//------SKY
function moveSky() {
  const backsky = {
    x: 0,
    y: 0,
    largura: canvas.width,
    altura: canvas.height - 40,
    atualiza() {
      const movimentosky = 0.3;
      const repete = backsky.largura;
      const movimento = backsky.x - movimentosky;
      backsky.x = movimento % repete;
    },
    desenha() {
      ctx.drawImage(sky, backsky.x, backsky.y, backsky.largura, backsky.altura);
      ctx.drawImage(
        sky,
        backsky.x + backsky.largura,
        backsky.y,
        backsky.largura,
        backsky.altura
      );
    },
  };
  return backsky;
}

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
  if (telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

//------TELAS
const telas = {
  inicio: {
    inicializa() {
      globais.player = criaPlayer();
      globais.floor = moveFloor();
      globais.backsky = moveSky();
    },
    desenha() {
      globais.backsky.desenha();
      globais.floor.desenha();
      globais.player.desenha();
      panel.desenha();
    },
    keydown() {
      mudaTela(telas.game);
    },
    atualiza() {
      globais.floor.atualiza();
      globais.backsky.atualiza();
    },
  },
};

telas.game = {
  inicializa() {},
  desenha() {
    globais.backsky.desenha();
    globais.floor.desenha();
    globais.player.desenha();
  },
  movi(num) {
    globais.player.fly(num);
  },
  atualiza() {
    globais.backsky.atualiza();
    globais.floor.atualiza();
    globais.player.atualiza();
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (telaAtiva == telas.inicio) {
    telaAtiva.keydown();
  } else {
    switch (event.key) {
      case "w":
        telaAtiva.movi(1);
        break;
      case "s":
        telaAtiva.movi(2);
        break;
    }
  }
});

mudaTela(telas.inicio);
loop();
