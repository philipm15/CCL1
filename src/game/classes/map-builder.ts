import {extractSpritesFromSpritesheet} from "../lib/sprite.ts";

export class MapBuilder {
    private static instance: MapBuilder;
    tiles: Record<string, HTMLCanvasElement> = {};

    async loadImages(): Promise<void> {
        const instance = MapBuilder.getInstance();
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            });
        };

        return Promise.all([
            loadImage('assets/spritesheets/interior.png').then((interiorImage) => {
                return extractSpritesFromSpritesheet(interiorImage, 89, 16, 392);
            }),
            loadImage('assets/spritesheets/room_builder.png').then((roomBuilderImage) => {
                return extractSpritesFromSpritesheet(roomBuilderImage, 23, 17);
            }),
        ]).then(([interiorTiles, roomBuilderTiles]) => {
            console.log("All images loaded successfully!");
            instance.tiles = {...roomBuilderTiles, ...interiorTiles};
        }).catch((err) => {
            console.error(err);
        });
    }

    static getInstance() {
        if (!MapBuilder.instance) {
            MapBuilder.instance = new MapBuilder();
        }

        return MapBuilder.instance;
    }
}
