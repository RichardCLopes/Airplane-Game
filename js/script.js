const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const globais = {};
let frames = 0;
let highscore = 0;
let framecall = 0;
let colisao = 0;

planesimg = [
  "./images/planes/plane_1_blue.png",
  "./images/planes/plane_1_pink.png",
  "./images/planes/plane_1_red.png",
  "./images/planes/plane_1_yellow.png",
  "./images/planes/plane_2_green.png",
  "./images/planes/plane_2_red.png",
  "./images/planes/plane_2_yellow.png",
  "./images/planes/plane_3_blue.png",
  "./images/planes/plane_3_green.png",
  "./images/planes/plane_3_red.png",
  "./images/planes/plane_3_yellow.png",
];

//---------IMAGES
const plane = new Image();
plane.src = "./images/planes/plane_2_blue.png";
const hill = new Image();
hill.src = "./images/background/floor.png";
const sky = new Image();
sky.src = "./images/background/sky.png";
const itf = new Image();
itf.src = "./images/interface/panel.png";
const explo = new Image();
explo.src = "./images/explosion/explosion.png";
const sunn = new Image();
sunn.src = "./images/background/sun.png";

//-------PLAYER
function criaPlayer() {
  const player = {
    x: 50,
    y: 350,
    largura: 200,
    altura: 110,
    frameatt: 0,
    linha: 2,
    move: 0, //1-up, 2-down
    fly(num) {
      if (num == 1 && player.linha > 0 && frames > player.frameatt) {
        player.frameatt = frames + 50;
        player.linha -= 1;
        player.move = 1;
      } else if (num == 2 && player.linha < 4 && frames > player.frameatt) {
        player.frameatt = frames + 50;
        player.linha += 1;
        player.move = 3;
      }
    },
    desenha() {
      ctx.drawImage(plane, player.x, player.y, player.largura, player.altura);
    },
    atualiza() {
      if (player.move == 1 && frames < player.frameatt) {
        player.y -= 3;
      } else if (player.move == 3 && frames < player.frameatt) {
        player.y += 3;
      }
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

//---------EXPLOSION
function explos() {
  const explosion = {
    x: 0,
    y: 0,
    largura: 500,
    altura: 500,
    xbn: 0,
    ybn: 0,
    movimentos: [
      { x: 0, y: 0 },
      { x: 500, y: 0 },
      { x: 1000, y: 0 },
      { x: 0, y: 500 },
      { x: 500, y: 500 },
      { x: 1000, y: 500 },
      { x: 0, y: 1000 },
      { x: 500, y: 1000 },
      { x: 1000, y: 1000 },
    ],
    frameatual: 0,
    attframe() {
      const intervaloDeFrames = 25;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + explosion.frameatual;
        const baseRepeticao = explosion.movimentos.length;
        explosion.frameatual = incremento % baseRepeticao;
      }
    },
    desenha() {
      console.log(frames);
      explosion.attframe();
      const { x, y } = explosion.movimentos[explosion.frameatual];
      ctx.drawImage(
        explo,
        x,
        y,
        explosion.largura,
        explosion.altura,
        explosion.xbn,
        explosion.ybn,
        400,
        400
      );
    },
  };
  return explosion;
}

alturas = [50, 200, 350, 500, 650];

function sorteiaAviao() {
  avirandom = new Image();
  var randomNumber = Math.floor(Math.random() * 11);
  avirandom.src = planesimg[randomNumber];
  return avirandom;
}

function criaPlacar() {
  const placar = {
    point: 0,
    desenha() {
      ctx.font = '40px "Luckiest Guy"';
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(
        `Score: ${placar.point}`,
        canvas.width / 2,
        canvas.height - 50
      );
    },
    atualiza() {
      const intervaloDeFrames = 150;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if (passouOIntervalo) {
        placar.point += 1;
      }
    },
  };
  return placar;
}

function msgGameOver() {
  const msgover = {
    point: 0,
    desenha() {
      ctx.font = '40px "Luckiest Guy"';
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.fillText(`Game Over`, canvas.width / 2, canvas.height / 2 - 70);
      ctx.fillText(
        `Score: ${msgover.point}`,
        canvas.width / 2,
        canvas.height / 2
      );
      ctx.fillText(
        `High Score: ${highscore}`,
        canvas.width / 2,
        canvas.height / 2 + 70
      );
    },
    atualiza() {
      msgover.point = globais.placar.point;
      if (highscore < msgover.point) {
        highscore = msgover.point;
      }
    },
  };
  return msgover;
}

const msgstart = {
  desenha() {
    ctx.font = '35px "Luckiest Guy"';
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText("W - Move up", canvas.width / 2, canvas.height / 2 - 70);
    ctx.fillText("S - Move down", canvas.width / 2, canvas.height / 2);
    ctx.fillText(
      "Press any key to start",
      canvas.width / 2,
      canvas.height / 2 + 70
    );
  },
};

function criaAvioes() {
  const aviao = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    largura: 200,
    altura: 110,
    pares: [],
    atualiza() {
      const passouperiodo = frames % 300 === 0;

      if (passouperiodo) {
        let n1 = Math.floor(Math.random() * 5);
        let n2 = -1;
        do {
          n2 = Math.floor(Math.random() * 5);
        } while (n1 == n2);
        aviao.pares.push(
          {
            x: canvas.width,
            y: alturas[n1],
            aviurl: sorteiaAviao(),
          },
          {
            x: canvas.width,
            y: alturas[n2],
            aviurl: sorteiaAviao(),
          }
        );
      }

      if (colisao == 1) {
        globais.explosion.desenha();
      }
      aviao.pares.forEach(function (loc) {
        loc.x -= 2;

        if (aviao.temColisao(loc)) {
          globais.explosion.xbn = globais.player.x - 50;
          globais.explosion.ybn = globais.player.y - 100;
          if (colisao == 0) {
            colisao = 1;
          }
          if (framecall == 0) {
            framecall = frames + 100;
          }
        }

        if (frames == framecall) {
          mudaTela(telas.gameover);
        }

        if (loc.x + aviao.largura <= 0) {
          aviao.pares.shift();
        }
      });
    },
    temColisao(loc) {
      const cimaaviao = globais.player.y;
      const baixoaviao = globais.player.y + globais.player.altura;
      if (
        globais.player.x + globais.player.largura >= loc.x &&
        cimaaviao >= loc.y &&
        cimaaviao <= loc.y
      ) {
        return true;
      } else if (
        globais.player.x + globais.player.largura >= loc.x &&
        baixoaviao >= loc.y &&
        baixoaviao <= loc.y
      ) {
        return true;
      } else {
        return false;
      }
    },
    desenha() {
      aviao.pares.forEach(function (loc) {
        ctx.drawImage(loc.aviurl, loc.x, loc.y, aviao.largura, aviao.altura);
      });
    },
  };
  return aviao;
}

let telaAtiva = {};
function mudaTela(novatela) {
  framecall = 0;
  colisao = 0;
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
      globais.planes = criaAvioes();
      globais.explosion = explos();
      globais.msgover = msgGameOver();
    },
    desenha() {
      globais.backsky.desenha();
      globais.floor.desenha();
      globais.player.desenha();
      panel.desenha();
      msgstart.desenha();
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
  inicializa() {
    globais.placar = criaPlacar();
  },
  desenha() {
    globais.backsky.desenha();
    globais.floor.desenha();
    globais.player.desenha();
    globais.planes.desenha();
    globais.placar.desenha();
  },
  movi(num) {
    globais.player.fly(num);
  },
  atualiza() {
    globais.backsky.atualiza();
    globais.floor.atualiza();
    globais.planes.atualiza();
    globais.placar.atualiza();
    globais.player.atualiza();
  },
};

telas.gameover = {
  desenha() {
    panel.desenha();
    globais.msgover.desenha();
  },
  atualiza() {
    globais.msgover.atualiza();
  },
  keydown() {
    mudaTela(telas.inicio);
  },
};

function loop() {
  telaAtiva.desenha();
  telaAtiva.atualiza();
  frames += 1;
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (event) => {
  if (telaAtiva == telas.inicio || telaAtiva == telas.gameover) {
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
