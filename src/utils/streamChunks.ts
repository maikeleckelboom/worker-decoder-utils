export async function streamChunks(
    stream: ReadableStream,
    onChunk: (chunk: Uint8Array) => void
): Promise<void> {
    const reader = stream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) onChunk(value);
    }
}
