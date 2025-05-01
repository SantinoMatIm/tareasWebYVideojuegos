/*
 * Base class for game objects in general
 *
 * Gilberto Echeverria
 * 2025-04-07
 */

class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.color = color;
        this.type = type;
    }


    draw(ctx) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                ctx.drawImage(this.spriteImage,
                    this.spriteRect.x, this.spriteRect.y, 
                    this.spriteRect.width, this.spriteRect.height,
                    this.position.x, this.position.y, 
                    this.width, this.height)
            }
            else {
                ctx.drawImage(this.spriteImage, 
                this.position.x, this.position.y, 
                this.width, this.height)
            }
            
                        
        }
        else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        
        this.drawBoundingBox(ctx);
    }

    //Create an image to be drawn for the object

    drawBoundingBox(ctx) {
        // Draw the bounding box of the sprite
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y,
                 this.width, this.height);
        ctx.stroke();
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }

    update(deltaTime) {
        if(this.spriteRect && this.sheetCols > 1) {
            this.frameTimer += deltaTime;
            if (this.frameTimer >= this.frameRate) {
                this.frameTimer = 0;
                this.frameIndex = (this.frameIndex + 1) % this.sheetCols;
            }
        }
    }
}


function boxOverlap(rect1, rect2) {
    return rect1.position.x < rect2.position.x + rect2.width &&
           rect1.position.x + rect1.width > rect2.position.x &&
           rect1.position.y < rect2.position.y + rect2.height &&
           rect1.position.y + rect1.height > rect2.position.y;
}

class AnimatedObject extends GameObject {
    constructor(position, width, height, color, type, sheetCols, sheetRows, spriteWidth, spriteHeight) {
        super(position, width, height, color, type);
        this.sheetCols = sheetCols;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeight;   
        this.sheetRows = sheetRows;
        this.currentFrame = 0;
        this.currentRow = 0;
        this.frameTime = 1000; // Time per frame in seconds
        this.lastFrameTime = 0;
    }

    update_frame(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= this.frameTime) {
            this.currentFrame = (this.currentFrame + 1) % this.sheetCols;
            
            console.log([this.currentFrame, this.lastFrameTime, deltaTime, this.frameTime]);
            this.lastFrameTime = 0;
        }
    }
    draw(ctx) {
        if (this.spriteImage){
            // Calculate the x position in the sprite sheet based on current frame
            const sourceX = this.currentFrame * this.spriteWidth;
            const sourceY = this.currentRow * this.spriteHeight; 
            
            ctx.drawImage(this.spriteImage, sourceX, sourceY, this.spriteWidth, this.spriteHeight,
                          this.position.x, this.position.y, this.width, this.height);
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
        this.drawBoundingBox(ctx);
    }

    setAnimationRow(row) {
        if (row >= 0 && row < this.sheetRows) {
            this.currentRow = row;
        }
    }

    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect;
        }
    }
    drawBoundingBox(ctx) {
        
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect(this.position.x, this.position.y,
                 this.width, this.height);
        ctx.stroke();
    }
    setFrameTime(frameTime) {
        this.frameTime = frameTime;
    }
    setCurrentFrame(currentFrame) {
        this.currentFrame = currentFrame;
    }
    setSheetCols(sheetCols) {
        this.sheetCols = sheetCols;
    }
    setLastFrameTime(lastFrameTime) {
        this.lastFrameTime = lastFrameTime;
    }
    setPosition(position) {
        this.position = position;
    }
    setWidth(width) {
        this.width = width;
    }
    setHeight(height) {
        this.height = height;
    }
    update(deltaTime) {
        this.lastFrameTime += deltaTime;
        if (this.lastFrameTime >= this.frameTime) {
            this.currentFrame = (this.currentFrame + 1) % this.sheetCols;
            this.lastFrameTime = 0;
        }
    }
}



