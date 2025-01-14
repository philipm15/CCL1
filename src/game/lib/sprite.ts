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
