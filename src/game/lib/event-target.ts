export function EventTargetMixin<T extends new (...args: any[]) => any>(Base: T) {
    return class extends Base {
        private eventTarget = new EventTarget();

        // Generic addEventListener to handle both Event and CustomEvent<T>
        addEventListener<K extends string, E extends Event>(
            type: K,
            listener: (event: E) => void,
            options?: boolean | AddEventListenerOptions
        ) {
            this.eventTarget.addEventListener(type, listener as EventListener, options);
        }

        removeEventListener<K extends string, E extends Event>(
            type: K,
            listener: (event: E) => void,
            options?: boolean | EventListenerOptions
        ) {
            this.eventTarget.removeEventListener(type, listener as EventListener, options);
        }

        dispatchEvent(event: Event): boolean {
            return this.eventTarget.dispatchEvent(event);
        }
    };
}

export class EventTargetBase extends EventTargetMixin(class {
}) {
}