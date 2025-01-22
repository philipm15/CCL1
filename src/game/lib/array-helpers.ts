export function shuffleArray<T = unknown[]>(array: T[]): T[] {
    if (array.length === 0) {
        console.warn("shuffleArray: Array is empty");
    }

    return (array || []).sort(() => Math.random() - 0.5);
}

export function getRandomArrayEntry<T = unknown>(array: T[]): T {
    if (array.length === 0) {
        throw new Error("getRandomArrayEntry: Array is empty");
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}