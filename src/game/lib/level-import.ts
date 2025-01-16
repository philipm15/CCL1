import { MAP_SIZE } from "./constants.ts";

export type JsonLevelData = {
    layers: Array<{
        data: number[];
        name: string;
    }>
}

export type LevelLayer = {
    name: string;
    matrix: number[][];
}

export function importLevelFromJson(data: JsonLevelData): LevelLayer[] {
    return data.layers
        .map(layer => ({
            name: layer.name,
            matrix: convertTo2DMatrix(layer.data, MAP_SIZE)
        }))
}

function convertTo2DMatrix(data: number[], size: number): number[][] {
    const matrix: number[][] = [];
    for (let row = 0; row < size; row++) {
        matrix.push(data.slice(row * size, (row + 1) * size));
    }
    return matrix;
}
