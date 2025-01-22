import {TILE_SIZE} from "./constants.ts";

export function extractFramesFromSpritesheet(
    image: HTMLImageElement,
    rows: number,
    columns: number,
    tileWidth: number = TILE_SIZE,
    tileHeight: number = TILE_SIZE,
): HTMLCanvasElement[][] {
    const frames: HTMLCanvasElement[][] = [];

    for (let row = 0; row < rows; row++) {
        const rowFrames: HTMLCanvasElement[] = [];
        for (let col = 0; col < columns; col++) {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Failed to get 2D context for canvas.");
            }

            canvas.width = tileWidth;
            canvas.height = tileHeight;

            // Draw the specific tile from the spritesheet
            ctx.drawImage(
                image,
                col * tileWidth,     // Source X
                row * tileHeight,    // Source Y
                tileWidth,           // Source Width
                tileHeight,          // Source Height
                0,                   // Destination X
                0,                   // Destination Y
                tileWidth,           // Destination Width
                tileHeight           // Destination Height
            );

            rowFrames.push(canvas);
        }
        frames.push(rowFrames);
    }

    return frames;
}

export function extractSpritesFromSpritesheet(
    image: HTMLImageElement,
    rows: number,
    columns: number,
    firstId = 1,
    tileWidth: number = TILE_SIZE,
    tileHeight: number = TILE_SIZE
): Record<number, HTMLCanvasElement> {
    const spriteMap: Record<number, HTMLCanvasElement> = {};
    if (!image.complete) {
        throw new Error("Failed to load sprites.");
    }

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error("Unable to create 2D context for canvas.");
    }

    // Iterate through the rows and columns of the spritesheet
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const spriteIndex = row * columns + col;

            // Create a new canvas for each sprite
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = tileWidth;
            spriteCanvas.height = tileHeight;

            const spriteContext = spriteCanvas.getContext('2d');
            if (!spriteContext) {
                throw new Error("Unable to create 2D context for sprite canvas.");
            }

            // Calculate the source x and y coordinates for the sprite
            const sx = col * tileWidth;
            const sy = row * tileHeight;

            // Draw the sprite onto the new canvas
            spriteContext.drawImage(
                image,
                sx, sy, tileWidth, tileHeight, // Source rectangle
                0, 0, tileWidth, tileHeight  // Destination rectangle
            );

            // Store the canvas in the map with its index
            spriteMap[spriteIndex + firstId] = spriteCanvas;
        }
    }

    return spriteMap;
}


export function loadSpriteByPath(filePath: string): Promise<HTMLImageElement> {
    const image = new Image();
    image.src = filePath;
    return new Promise((resolve, reject) => {
        image.onload = () => {
            resolve(image)
        };
        image.onerror = reject;
    });
}
