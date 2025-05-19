import type { Chunk, ChunkList } from "../types";

export function createBufferAccumulator() {
    const chunks: ChunkList = [];
    return {
        push(chunk: Chunk) {
            chunks.push(chunk);
        },
        getBuffer(): Uint8Array {
            const length = chunks.reduce((sum, c) => sum + c.length, 0);
            const result = new Uint8Array(length);
            let offset = 0;
            for (const c of chunks) {
                result.set(c, offset);
                offset += c.length;
            }
            return result;
        },
    };
}
