interface Promise<T> {
    finally: (onfinally?: (() => void) | null | undefined) => Promise<T>;
}
