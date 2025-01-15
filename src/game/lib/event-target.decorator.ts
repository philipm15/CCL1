export function EventTargetMixin<T extends new (...args: any[]) => any>(Base: T) {
    return class extends Base {
        private eventTarget = new EventTarget();

        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
            this.eventTarget.addEventListener(type, listener, options);
        }

        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
            this.eventTarget.removeEventListener(type, listener, options);
        }

        dispatchEvent(event: Event): boolean {
            return this.eventTarget.dispatchEvent(event);
        }
    };
}
