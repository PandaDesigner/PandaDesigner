
// <---- CONSTANTES -------->

let DIRECCIONES = {
    ARRIBA: 1,
    ABAJO: 2,
    IZQUIERDA: 3,
    DERECHA: 4,
};

//velocidad del juego por segundo
FPS = 1000 / 15;

let JUEGO_CANVAS = document.getElementById("juegoCanvas");
let CTX = JUEGO_CANVAS.getContext("2d");
let CONTENEDOR_NINTENDO = document.getElementById('cNintendo');
let PUNTOS_TEXTO = document.getElementById('PUNTUACION');
let BANNER_ROTAR_TELEFONO = document.getElementById('bannerRotarTelefono');
let TITULO = document.getElementById('titulos');
let BOTON_CERRAR_BANNER = document.getElementById('bottonCerrarBanner');
let SONIDO_GANASTE_PUNTO = new Audio('ganaste_un_punto.wav');
let GAME_OVER = new Audio('Sonido-Pacman_Game-Over.wav');
let CCS_CLASS_SACUDIR = 'shake-bl';
let CSS_CLASS_ESCONDER = 'esconder';

// <---- FIN CONSTANTES ------>

// <------ ESTADOS DEL JUEGO ------->

let culebra; //posicion de la culebra inicial en un array
let direccionActual;
let nuevaDireccion;
let comida;
let ciclo;
let puntos;



//funcion para la direccion de la culebra
function moverCulebra(direccion, culebra) {
    let cabezaPosX = culebra[0].posX;
    let cabezaPosY = culebra[0].posY;

    if (direccion === DIRECCIONES.DERECHA) {
        cabezaPosX += 20;
        } else if (direccion === DIRECCIONES.IZQUIERDA) {
        cabezaPosX -= 20;
        } else if (direccion === DIRECCIONES.ABAJO) {
        cabezaPosY += 20;
        } else if (direccion === DIRECCIONES.ARRIBA) {
        cabezaPosY -= 20;
        }

    // Agregamos la nueva cabeza al principio de la lista
    culebra.unshift({ posX: cabezaPosX, posY: cabezaPosY });
    // Borramos la cola de la culebra
    return culebra.pop();
    }
 /** COMIDA POSICION **/
//<------- POSICION RANDOW COMIDA-------->
function generarNuevaPosicionDeCominda(culebra) {
    while (true) {
        let columnaX = Math.max(Math.floor(Math.random()*29),1);
        let columnaY = Math.max(Math.floor(Math.random()*29),1);

        let posX = columnaX * 20;
        let posY = columnaY * 20;

        let colisionConCulebra = false;
        for (let i = 0; i < culebra.length; i++) {
            if (culebra[i].posX === posX && culebra[i].posY === posY) {
                colisionConCulebra === true;
                break;
            }
        }
        if (colisionConCulebra === true) {
            continue;
        }

        return {posX: posX, posY: posY};
    }
}

function culebraComioComida(culebra, comida){
    return culebra[0].posX === comida.posX && culebra[0].posY === comida.posY;
}

    //<------DIBUJAR------->
/*
//funcion para dibuar culebra
function dibujarCuadricula(context) {
//Linias en "X" horizontales
    for (let x = 20; x < 600 ; x += 20) {
        context.beginPath();
        context.fillStyle = "black";
        context.moveTo(x, 0);
        context.lineTo(x, 600);
        context.stroke();
    }
    //Linias en "Y" verticales
    for (let y = 20; y < 600 ; y += 20) {
        context.beginPath();
        context.fillStyle = "black";
        context.moveTo(0, y);
        context.lineTo(600, y);
        context.stroke();
    }
}
*/

//rellenar cuadrados
function rellenarCuadrado(context, posX, posY) {
    context.beginPath();
    context.fillStyle = "#2e490b";
    context.fillRect(posX, posY, 20, 20);
    context.stroke();
}
// dibujar marco de rectangulo
function dibujarParedes(context){
    context.beginPath();
    context.lineWidth = "2";
    context.rect(20, 20, 560, 560);
    context.stroke();
}
//dibujar textcol
function dibujarTexto(context, texto, x, y) {
  context.font = "30px Fira Code";
  context.textAlign = "center";
  context.fillStyle = "#2e490b";
  context.fillText(texto, x, y);
}
function dibujarTexto2(context, texto, x, y) {
  context.font = "25px Fira Code";
  context.textAlign = "center";
  context.fillStyle = "#2e490b";
  context.fillText(texto, x, y);
}
function dibujarTexto3(context, texto, x, y) {
  context.font = "15px Fira Code";
  context.textAlign = "center";
  context.fillStyle = "#2e490b";
  context.fillText(texto, x, y);
}

//movimiento de la culebra
function dibujarCulebra(context, culebra) {
    for(let i= 0; i < culebra.length; i++) {
        rellenarCuadrado(context, culebra[i].posX, culebra[i].posY);
    }
}
 //<-------DIBUJAR COMIDA----->

        function dibujarComida(context, comida) {

            rellenarCuadrado(context, comida.posX, comida.posY);

    }



/*<---COLISIONES--->*/
function ocurrioColision(culebra) {
        let cabeza = culebra[0];

    if (cabeza.posX < 20 ||
        cabeza.posY < 20 ||
        cabeza.posX >= 580 ||
        cabeza.posY >= 580) {

        console.log("Papí la pared no se come!!!");
        return true;
        }
        if (culebra.length === 1) {
          return false;
        }

        for (let i = 1; i < culebra.length; i++) {
          if (cabeza.posX === culebra[i].posX && cabeza.posY === culebra[i].posY) {

            return true;

          }
        }

     return false;

}

//<--------PUNTUACION -------->

function mostrarPuntos(puntos){
  PUNTOS_TEXTO.innerText = "PUNTOS: " + puntos;
  }
function incrementarPuntaje(){
  puntos++;
  mostrarPuntos(puntos);
  SONIDO_GANASTE_PUNTO.play();
}
//<-------RESPONSIVE-------->

window.addEventListener("orientationchange",function () {
    TITULO.classList.add(CSS_CLASS_ESCONDER);
    BANNER_ROTAR_TELEFONO.classList.remove(CSS_CLASS_ESCONDER);
});
BOTON_CERRAR_BANNER.addEventListener("click", function() {
    TITULO.classList.remove(CSS_CLASS_ESCONDER);
    BANNER_ROTAR_TELEFONO.classList.add(CSS_CLASS_ESCONDER);
});


//<------ CICLO DEL JUEGO -------->
//opcion para mover culebra
document.addEventListener("keydown", function (e) {

        if (e.code === "ArrowUp" && direccionActual !== DIRECCIONES.ABAJO) {
        nuevaDireccion = DIRECCIONES.ARRIBA;
        } else if (e.code ==="ArrowDown" && direccionActual !== DIRECCIONES.ARRIBA) {
        nuevaDireccion = DIRECCIONES.ABAJO;
        } else if (e.code === "ArrowLeft" && direccionActual !== DIRECCIONES.DERECHA) {
        nuevaDireccion = DIRECCIONES.IZQUIERDA;
        }else if (e.code ==="ArrowRight" && direccionActual !== DIRECCIONES.IZQUIERDA){
        nuevaDireccion = DIRECCIONES.DERECHA;
        }
    });


function cicloDeJuego() {

    let colaDescartada = moverCulebra(nuevaDireccion, culebra);
    direccionActual = nuevaDireccion;

    if (culebraComioComida(culebra, comida)) {
        culebra.push(colaDescartada);
        comida = generarNuevaPosicionDeCominda(culebra);
        incrementarPuntaje();
    }

if (ocurrioColision(culebra)) {
    clearInterval(ciclo);
    dibujarTexto(CTX, "!CLICK para empezar¡", 300, 260);
    dibujarTexto(CTX, "GAME OVER", 300, 310);
    GAME_OVER.play();
    CONTENEDOR_NINTENDO.classList.add(CCS_CLASS_SACUDIR);
    ciclo = undefined
    return;
}

    CTX.clearRect(0, 0, 600, 600);
    dibujarParedes(CTX);
    dibujarCulebra(CTX, culebra);
    dibujarComida(CTX, comida);
}

function empezarJuego() {
  // <------ ESTADOS DEL JUEGO ------->
  //posicion de la culebra inicial en un array
  culebra = [
      {posX: 60, posY: 20},
      {posX: 40, posY: 20},
      {posX: 20, posY: 20},
  ];

  //variable para la condicional que evita el retroseso
  direccionActual = DIRECCIONES.DERECHA;
  nuevaDireccion = DIRECCIONES.DERECHA;

  comida = generarNuevaPosicionDeCominda(culebra);
  puntos = 0;

  mostrarPuntos(puntos);
  CONTENEDOR_NINTENDO.classList.remove(CCS_CLASS_SACUDIR);

ciclo = setInterval(cicloDeJuego, FPS);
}

//dibujar canvas y dibujar culebra
dibujarParedes(CTX);
dibujarTexto(CTX, "!CLICK para empezar¡", 300, 260);
dibujarTexto(CTX, "Desktop: Muévete con ↑ ↓ → ←", 300, 310);
dibujarTexto2(CTX, "Móvil TAP para Mover la culebra", 300, 345);
dibujarTexto3(CTX, " Desarrollado por Pedro Fernández 2021 Derechos Reservados", 300, 375);

JUEGO_CANVAS.addEventListener("click", function () {
    if (ciclo === undefined) {
        empezarJuego();
        return;
    }

    if (direccionActual === DIRECCIONES.ABAJO) {
      nuevaDireccion = DIRECCIONES.IZQUIERDA;
    }
    else if (direccionActual === DIRECCIONES.IZQUIERDA) {
        nuevaDireccion = DIRECCIONES.ARRIBA;
    }
    else if (direccionActual === DIRECCIONES.ARRIBA) {
      nuevaDireccion = DIRECCIONES.DERECHA;
    }
    else if (direccionActual === DIRECCIONES.DERECHA) {
      nuevaDireccion = DIRECCIONES.ABAJO;
    }

});
