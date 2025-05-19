/**
 * Synchronous Blob URL creation on main thread.
 */
export function bufferToBlobUrl(
    buffer: Uint8Array,
    type: string = "image/png"
): string {
    const blob = new Blob([buffer], { type });
    return URL.createObjectURL(blob);
}
