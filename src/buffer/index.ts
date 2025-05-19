import { bufferToBlobUrl as syncUrl } from "../utils/blob";
import { toBlobUrlWithDedicatedWorker } from "./dedicated";
import { toBlobUrlWithSharedWorker } from "./shared";
import type { ChunkList } from "../types";

export type Strategy = "sync" | "dedicated" | "shared";

/**
 * Merge multiple chunks into a single Uint8Array
 */
export function mergeChunks(chunks: ChunkList): Uint8Array {
    const total = chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(total);
    let offset = 0;

    for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
    }

    return combined;
}

/**
 * Unified API
 */
export function bufferToBlobUrl(
    chunks: ChunkList,
    type: string = "image/png",
    strategy: Strategy = "shared"
): Promise<string> | string {
    switch (strategy) {
        case "sync": {
            const combined = mergeChunks(chunks);
            return syncUrl(combined, type);
        }
        case "dedicated":
            return toBlobUrlWithDedicatedWorker(chunks, type);
        case "shared":
        default:
            return toBlobUrlWithSharedWorker(chunks, type);
    }
}
