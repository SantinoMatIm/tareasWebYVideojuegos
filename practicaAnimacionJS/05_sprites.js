/*
 * Simple animation on the HTML canvas
 *
 * Santino Im
 * 2025-04-21
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Context of the Canvas
let ctx;

// A variable to store the game object
let game;

// Variable to store the time at the previous frame
let oldTime;

let playerSpeed = 0.5;

const keyDirections = {
    w: "up",
    s: "down",
    a: "left",
    d: "right",
}

const playerMovement = {
    up: {
        axis: "y",
        direction: -1,
    },
    down: {
        axis: "y",
        direction: 1,
    },
    left: {
        axis: "x",
        direction: -1,
    },
    right: {
        axis: "x",
        direction: 1,
    },
    idle: {
        axis: "y",
        direction: 0,
    }
};

// Class for the main character in the game
class Player extends AnimatedObject {
    constructor(position, width, height, color, sheetCols, sheetRows) {
        super(position, width, height, color, "player", 10, 8, 120, 130);
        this.velocity = new Vec(0, 0);
        this.keys = [];
        this.direction = "down";

        this.directionRows = {
            down: 0,
            left: 1,
            up: 2,
            right: 3
        };
    }

    update(deltaTime) {
        this.setVelocity();

        if (this.velocity.x !== 0 || this.velocity.y !== 0) {
            super.update(deltaTime);
            this.updateDirection();
        }
        else {
            this.currentFrame = 0;
        }

        this.position = this.position.plus(this.velocity.times(deltaTime));

        this.constrainToCanvas();
    }

    updateDirection() {
        let oldDirection = this.direction;

        if (Math.abs(this.velocity.x) > Math.abs(this.velocity.y)) {
            if (this.velocity.x > 0) {
                this.direction = "right";
            } else if (this.velocity.x < 0) {
                this.direction = "left";
            }
        } else if (this.velocity.y !== 0) {
            if (this.velocity.y > 0) {
                this.direction = "down";
            } else if (this.velocity.y < 0) {
                this.direction = "up";
            }
        }
        if (oldDirection !== this.direction) {
            this.setAnimationRow(this.directionRows[this.direction]);
        }
    }

    constrainToCanvas() {
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }

    setVelocity() {
        this.velocity = new Vec(0, 0);
        for (const key of this.keys) {
            const move = playerMovement[key];
            this.velocity[move.axis] += move.direction;
        }
        this.velocity = this.velocity.normalize().times(playerSpeed);
    }

}
class Coin extends AnimatedObject {
    constructor(position, width, height, color, sheetCols, sheetRows, spriteWidth, spriteHeight) {
        super(position, width, height, color, "coin", sheetCols, sheetRows, spriteWidth, spriteHeight);
        this.velocity = new Vec(0, 0);
        this.keys = []
        this.collected = false;
    }

    update(deltaTime) {
        if(!this.collected) {
            if(typeof super.update_frame === 'function') {
                super.update_frame(deltaTime);
            }
            else{
                super.update(deltaTime);
            }
        }
    }

    draw(ctx) {
        if(!this.collected) {
            super.draw(ctx);
        }
    }

    collect() {
        this.collected = true;
    }

    constrainToCanvas() {
        if (this.position.y < 0) {
            this.position.y = 0;
        } else if (this.position.y + this.height > canvasHeight) {
            this.position.y = canvasHeight - this.height;
        } else if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }

}


// Class to keep track of all the events and objects in the game
class Game {
    constructor() {
        this.createEventListeners();
        this.initObjects();
    }

    initObjects() {
        // Crear jugador
        this.player = new Player(new Vec(canvasWidth / 2, canvasHeight / 2), 60, 60, "green", 10, 4);
        this.player.setSprite('../assets/sprites/link_sprite_sheet.png');
        this.player.setFrameTime(2000);
        this.player.setAnimationRow(this.player.directionRows["down"]);
        
        // Crear monedas
        this.coins = []; // Usa "coins" en lugar de "coin"
        for (let i = 0; i < 5; i++) {
            let coinX = Math.random() * (canvasWidth - 60);
            let coinY = Math.random() * (canvasHeight - 60);
            let coin = new Coin(new Vec(coinX, coinY), 30, 30, "yellow", 8, 1, 32, 32);
            coin.setSprite('../assets/sprites/coin_gold.png', new Rect(0, 0, 16, 16));
            coin.setFrameTime(100);
            this.coins.push(coin);
        }
        
        this.actors = [];
    }

    draw(ctx) {
        for (let actor of this.actors) {
            actor.draw(ctx);
        }
        
        // Dibujar todas las monedas
        for (let coin of this.coins) {
            coin.draw(ctx);
        }
        
        this.player.draw(ctx);
    }

    update(deltaTime) {
        for (let actor of this.actors) {
            actor.update(deltaTime);
        }
        
        this.player.update(deltaTime);
        
        // Actualizar cada moneda individualmente
        for (let coin of this.coins) {
            coin.update(deltaTime);
            
            // Verificar colisión
            if (!coin.collected && this.checkCollision(this.player, coin)) {
                coin.collect();
            }
        }
        
        // Filtrar monedas recolectadas
        this.coins = this.coins.filter(coin => !coin.collected);
        
        // Generar nuevas monedas si hay menos de 3
        if (this.coins.length < 3) {
            let coinX = Math.random() * (canvasWidth - 60);
            let coinY = Math.random() * (canvasHeight - 60);
            let newCoin = new Coin(new Vec(coinX, coinY), 30, 30, "yellow", 8, 1, 32, 32);
            newCoin.setSprite('../assets/sprites/coin_gold.png', new Rect(0, 0, 16, 16));
            newCoin.setFrameTime(100);
            this.coins.push(newCoin);
        }
    }

    checkCollision(obj1, obj2) {
        return obj1.position.x < obj2.position.x + obj2.width &&
               obj1.position.x + obj1.width > obj2.position.x &&
               obj1.position.y < obj2.position.y + obj2.height &&
               obj1.position.y + obj1.height > obj2.position.y;
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (Object.keys(keyDirections).includes(event.key)) {
                this.add_key(keyDirections[event.key]);
            }
        });

        window.addEventListener('keyup', (event) => {
            if (Object.keys(keyDirections).includes(event.key)) {
                this.del_key(keyDirections[event.key]);
            }
        });
    }

    add_key(direction) {
        if (!this.player.keys.includes(direction)) {
            this.player.keys.push(direction);
        }
    }

    del_key(direction) {
        let index = this.player.keys.indexOf(direction);
        if (index != -1) {
            this.player.keys.splice(index, 1);
        }
    }
}


// Starting function that will be called from the HTML page
function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    // Create the game object
    game = new Game();

    drawScene(0);
}


// Main loop function to be called once per frame
function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = (newTime - oldTime);

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    game.draw(ctx);
    game.update(deltaTime);

    oldTime = newTime;
    requestAnimationFrame(drawScene);
}
