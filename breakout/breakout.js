/*
 * Implementation of the game of Breakout
 * Based on the Pong game seen in class
 * Santino Im
 * 2025-04-29
 */

"use strict";

// Global variables
const canvasWidth = 800;
const canvasHeight = 600;

// Variable to store the times for the frames
let oldTime;

// Global settings
const paddleVelocity = 0.8;
const speedIncrease = 1.05;
const initialSpeed = 0.3;

// Context of the Canvas
let ctx;

// The game object
let game;

// Classes for the Breakout game
class Ball extends GameObject {
    constructor(position, width, height, color) {
        // Call the parent's constructor
        super(position, width, height, color, "ball");
        this.reset();
    }

    update(deltaTime) {
        // Change the position depending on the velocity
        this.position = this.position.plus(this.velocity.times(deltaTime));
    }

    initVelocity() {
        // Define an upward angle in the range [-45°, 45°]
        const angle = Math.random() * Math.PI / 2 - Math.PI / 4;
        // Obtain the direction of the ball movement
        this.velocity = new Vec(Math.cos(angle), -Math.sin(angle)).times(initialSpeed);
        // Randomly select a direction (left or right)
        this.velocity.x *= Math.random() > 0.5 ? 1 : -1;
        this.inPlay = true;
    }

    reset() {
        // Ball starts above the paddle
        this.position = new Vec(canvasWidth / 2, canvasHeight - 50);
        this.velocity = new Vec(0, 0);
        this.inPlay = false;
    }
}

class Paddle extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "paddle");
        this.velocity = new Vec(0, 0);
    }

    update(deltaTime) {
        // Change the position depending on the velocity
        this.position = this.position.plus(this.velocity.times(deltaTime));

        // Constrain the motion to be within the canvas size
        if (this.position.x < 0) {
            this.position.x = 0;
        } else if (this.position.x + this.width > canvasWidth) {
            this.position.x = canvasWidth - this.width;
        }
    }
}

class Brick extends GameObject {
    constructor(position, width, height, color) {
        super(position, width, height, color, "brick");
        this.active = true;
        this.points = 10;
    }

    hit() {
        this.active = false;
        return this.points;
    }

    draw(ctx) {
        if (this.active) {
            super.draw(ctx);
        }
    }
}

// Class that controls all the objects in the game
class Game {
    constructor(canvasWidth, canvasHeight) {
        // Game configuration - can be modified
        this.config = {
            rows: 5,           // Number of brick rows
            columns: 10,       // Number of brick columns
            brickWidth: 70,    // Width of each brick
            brickHeight: 30,   // Height of each brick
            brickMargin: 5,    // Margin between bricks
            initialLives: 3    // Starting number of lives
        };
        
        // Create instances for all objects in the game
        this.ball = new Ball(new Vec(canvasWidth / 2, canvasHeight - 50),
                             15, 15, "black");
        this.paddle = new Paddle(new Vec(canvasWidth / 2 - 50, canvasHeight - 30),
                             100, 15, "blue");
        
        this.leftWall = new GameObject(new Vec(0, 0), 10, canvasHeight, "red", "barrier");
        this.rightWall = new GameObject(new Vec(canvasWidth - 10, 0), 10, canvasHeight, "red", "barrier");
        this.topWall = new GameObject(new Vec(0, 0), canvasWidth, 10, "red", "barrier");
        this.bottomLine = new GameObject(new Vec(0, canvasHeight), canvasWidth, 10, "white", "deathZone");

        this.scoreLabel = new TextLabel(new Vec(20, 30), "20px Arial", "black");
        this.livesLabel = new TextLabel(new Vec(canvasWidth - 100, 30), "20px Arial", "black");
        this.bricksDestroyedLabel = new TextLabel(new Vec(canvasWidth/2 - 80, 30), "20px Arial", "black");
        this.gameOverLabel = new TextLabel(new Vec(canvasWidth/2 - 150, canvasHeight/2), "40px Arial", "red");
        
        this.hitSFX = document.createElement("audio");
        this.hitSFX.src = "../assets/sfx/campana.mp3"; // Reusing Pong's sound
        
        this.loseSFX = document.createElement("audio");
        this.loseSFX.src = "../assets/music/finally.ogg"; // Reusing Pong's sound

        this.music = document.createElement("audio");
        this.music.src = "../assets/music/troll.mp3"; // Reusing Pong's music
        this.music.addEventListener("ended", function(){
            this.currentTime = 0;
            this.play();
        });

        this.score = 0;
        this.lives = this.config.initialLives;
        this.bricksDestroyed = 0;
        this.totalBricks = this.config.rows * this.config.columns;
        this.gameOver = false;
        this.bricks = [];
        
        this.createBricks();
        this.createEventListeners();
    }

    createBricks() {
        const offsetTop = 50;
        const offsetLeft = (canvasWidth - ((this.config.brickWidth + this.config.brickMargin) * this.config.columns - this.config.brickMargin)) / 2;
        
        // Colors for different rows (cycle if there are more rows than colors)
        const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF"];
        
        for (let row = 0; row < this.config.rows; row++) {
            // Select color based on row (loop through colors if needed)
            const colorIndex = row % colors.length;
            
            for (let col = 0; col < this.config.columns; col++) {
                const position = new Vec(
                    offsetLeft + (this.config.brickWidth + this.config.brickMargin) * col,
                    offsetTop + (this.config.brickHeight + this.config.brickMargin) * row
                );
                const brick = new Brick(position, this.config.brickWidth, this.config.brickHeight, colors[colorIndex]);
                // Assign more points to bricks at the top
                brick.points = (this.config.rows - row) * 10;
                this.bricks.push(brick);
            }
        }
        
        // Update total bricks count
        this.totalBricks = this.bricks.length;
    }

    update(deltaTime) {
        if (this.gameOver) return;
        
        this.paddle.update(deltaTime);
        this.ball.update(deltaTime);
        
        // Check collisions with walls
        if (boxOverlap(this.ball, this.leftWall) || boxOverlap(this.ball, this.rightWall)) {
            this.ball.velocity.x *= -1;
            this.hitSFX.play();
        }
        
        if (boxOverlap(this.ball, this.topWall)) {
            this.ball.velocity.y *= -1;
            this.hitSFX.play();
        }
        
        // Check collision with paddle
        if (boxOverlap(this.ball, this.paddle)) {
            if (this.ball.velocity.y > 0) {
                // Calculate the hit position on the paddle (0 to 1)
                const hitPos = (this.ball.position.x + this.ball.width/2 - this.paddle.position.x) / this.paddle.width;
                // Calculate angle (-60° to 60°)
                const angle = (hitPos - 0.5) * Math.PI * 2/3;
                
                // Set new velocity direction based on hit position
                this.ball.velocity = new Vec(Math.sin(angle), -Math.cos(angle)).times(
                    this.ball.velocity.length() * speedIncrease
                );
                
                this.hitSFX.play();
            }
        }
        
        // Check collisions with bricks
        for (let i = 0; i < this.bricks.length; i++) {
            if (this.bricks[i].active && boxOverlap(this.ball, this.bricks[i])) {
                // Determine which side of the brick was hit
                const ballCenter = new Vec(
                    this.ball.position.x + this.ball.width/2,
                    this.ball.position.y + this.ball.height/2
                );
                const brickCenter = new Vec(
                    this.bricks[i].position.x + this.bricks[i].width/2,
                    this.bricks[i].position.y + this.bricks[i].height/2
                );
                
                const dX = ballCenter.x - brickCenter.x;
                const dY = ballCenter.y - brickCenter.y;
                
                // If the ball hits the brick more from the sides, reverse X velocity
                // Otherwise, reverse Y velocity
                if (Math.abs(dX / this.bricks[i].width) > Math.abs(dY / this.bricks[i].height)) {
                    this.ball.velocity.x *= -1;
                } else {
                    this.ball.velocity.y *= -1;
                }
                
                // Add points and deactivate brick
                this.score += this.bricks[i].hit();
                this.bricksDestroyed++;
                this.hitSFX.play();
                
                // Only handle one collision per frame
                break;
            }
        }
        
        // Check if ball goes beyond the bottom line
        if (this.ball.position.y > canvasHeight) {
            this.lives--;
            this.loseSFX.play();
            
            if (this.lives <= 0) {
                this.gameOver = true;
                this.music.pause();
            } else {
                this.ball.reset();
            }
        }
        
        // Check if all bricks are destroyed
        if (this.bricksDestroyed >= this.totalBricks) {
            this.gameOver = true;
            this.score += this.lives * 100; // Bonus for remaining lives
        }
    }

    draw(ctx) {
        // Draw all objects in the game
        this.leftWall.draw(ctx);
        this.rightWall.draw(ctx);
        this.topWall.draw(ctx);
        
        // Draw bricks
        for (let i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw(ctx);
        }
        
        this.paddle.draw(ctx);
        this.ball.draw(ctx);
        
        // Draw score, lives and bricks destroyed counter
        this.scoreLabel.draw(ctx, `Score: ${this.score}`);
        this.livesLabel.draw(ctx, `Lives: ${this.lives}`);
        this.bricksDestroyedLabel.draw(ctx, `Bloques: ${this.bricksDestroyed}/${this.totalBricks}`);
        
        // Draw game over message if needed
        if (this.gameOver) {
            if (this.bricksDestroyed >= this.totalBricks) {
                this.gameOverLabel.draw(ctx, "YOU WIN!");
            } else {
                this.gameOverLabel.draw(ctx, "GAME OVER");
            }
        }
    }

    createEventListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.key === "ArrowLeft") {
                this.paddle.velocity.x = -paddleVelocity;
            }
            if (event.key === "ArrowRight") {
                this.paddle.velocity.x = paddleVelocity;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === "ArrowLeft" && this.paddle.velocity.x < 0) {
                this.paddle.velocity.x = 0;
            }
            if (event.key === "ArrowRight" && this.paddle.velocity.x > 0) {
                this.paddle.velocity.x = 0;
            }

            if (event.key === " ") {
                if (!this.ball.inPlay && !this.gameOver) {
                    this.ball.initVelocity();
                    this.music.play();
                } else if (this.gameOver) {
                    // Restart the game
                    this.score = 0;
                    this.lives = this.config.initialLives;
                    this.bricksDestroyed = 0;
                    this.gameOver = false;
                    this.ball.reset();
                    
                    // Reactivate all bricks
                    this.bricks = [];
                    this.createBricks();
                    
                    // Play music if it's not already playing
                    if (this.music.paused) {
                        this.music.currentTime = 0;
                        this.music.play();
                    }
                }
            }
        });
        
        // Add mouse control for the paddle
        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            
            // Update paddle position directly, keeping it within bounds
            const newX = mouseX - this.paddle.width / 2;
            if (newX >= 0 && newX <= canvasWidth - this.paddle.width) {
                this.paddle.position.x = newX;
            }
        });
    }
}

function main() {
    // Get a reference to the object with id 'canvas' in the page
    const canvas = document.getElementById('canvas');
    // Resize the element
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    // Get the context for drawing in 2D
    ctx = canvas.getContext('2d');

    game = new Game(canvasWidth, canvasHeight);

    drawScene(0);
}

function drawScene(newTime) {
    if (oldTime == undefined) {
        oldTime = newTime;
    }
    let deltaTime = newTime - oldTime;

    // Clean the canvas so we can draw everything again
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update all game objects
    game.update(deltaTime);

    // Draw all game objects
    game.draw(ctx);

    // Update the time for the next frame
    oldTime = newTime;
    requestAnimationFrame(drawScene);
}