export class Input {
    private keys: Set<string>;
    private onKeyUpCallbacks: Array<(key: string) => void> = [];

    constructor() {
        this.keys = new Set();
        window.addEventListener('keydown', (e) => this.keys.add(e.key));
        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key);

            this.onKeyUpCallbacks.forEach(callback => callback(e.key));
        });
    }

    isKeyPressed(key: string): boolean {
        return this.keys.has(key);
    }

    addOnKeyUpCallback(callback: (key: string) => void) {
        this.onKeyUpCallbacks.push(callback);
    }
}
