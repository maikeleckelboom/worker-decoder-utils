import type { ChunkList } from "../types";
import { mergeChunks } from "./index";

/**
 * Creates a new worker for each call (simple, concurrency safe)
 */
export function toBlobUrlWithDedicatedWorker(
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

    return new Promise((resolve, reject) => {
        const worker = new Worker(
            new URL("./worker.ts", import.meta.url),
            { type: "module" }
        );
        worker.onmessage = (e) => {
            resolve(e.data.url);
            worker.terminate();
        };
        worker.onerror = (err) => {
            reject(err);
            worker.terminate();
        };
        worker.postMessage({ id: 0, chunks, type: mimeType });
    });
}
