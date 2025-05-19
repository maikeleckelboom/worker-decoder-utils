import type { ChunkList } from "../types";
import type { BlobWorkerRequest } from "../types";
import { mergeChunks } from "./index";

let worker: Worker | null = null;
let counter = 0;
const pending = new Map<number, (url: string) => void>();

/**
 * Shared worker instance with ID routing
 */
export function toBlobUrlWithSharedWorker(
    chunks: ChunkList,
    mimeType: string
): Promise<string> {
    // Check if running in a test environment that might not support workers
    const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';

    if (isTestEnv && typeof window !== 'undefined' && typeof Worker === 'undefined') {
        // Fallback implementation for environments without Worker support
        const combined = mergeChunks(chunks);
        const blob = new Blob([combined], { type: mimeType });
        return Promise.resolve(URL.createObjectURL(blob));
    }

    if (!worker) {
        worker = new Worker(
            new URL("./worker.ts", import.meta.url),
            { type: "module" }
        );
        worker.onmessage = (
            e: MessageEvent<BlobWorkerRequest & { url: string }>
        ) => {
            const { id, url } = e.data;
            const resolve = pending.get(id);
            if (resolve) {
                resolve(url);
                pending.delete(id);
            }
        };
        worker.onerror = (err) => {
            pending.forEach((res) => res("")); // or reject globally
            pending.clear();
        };
    }

    return new Promise((resolve) => {
        const id = counter++;
        pending.set(id, resolve);
        const msg: BlobWorkerRequest = { id, chunks, type: mimeType };
        worker!.postMessage(msg);
    });
}
