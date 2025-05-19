import type { Chunk } from "../types";

/**
 * Pipes all chunks from a ReadableStream to a `push` function.
 */
export async function streamChunks(
    stream: ReadableStream<Uint8Array>,
    push: (chunk: Chunk) => void
): Promise<void> {
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) push(value);
    }
    reader.releaseLock();
}
