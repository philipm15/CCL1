export class Input {
    private keys: Set<string>;

    constructor() {
        this.keys = new Set();
        window.addEventListener('keydown', (e) => this.keys.add(e.key));
        window.addEventListener('keyup', (e) => {
            this.keys.delete(e.key);
        });
    }

    isKeyPressed(key: string): boolean {
        return this.keys.has(key);
    }

    static onKeyPress(key: string, callback: (key: string, event: KeyboardEvent) => void) {
        return window.addEventListener('keydown', (e) => {
            if(e.key === key) {
                callback(e.key, e)
            }
        });
    }
}
