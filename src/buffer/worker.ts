import { createBufferAccumulator } from "../utils/accumulator";
import type { BlobWorkerRequest } from "../types";
import type { BlobWorkerRequest } from "../types";

self.onmessage = (e: MessageEvent<BlobWorkerRequest>) => {
    const { id, chunks, type } = e.data;

    // Combine chunks
    const total = chunks.reduce((sum, c) => sum + c.length, 0);
    const combined = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
    }

    // Create blob URL
    const blob = new Blob([combined], { type });
    const url = URL.createObjectURL(blob);

    // Send back to main thread
    self.postMessage({ id, url });
};
self.onmessage = (e: MessageEvent<BlobWorkerRequest>) => {
    const { id, chunks, type } = e.data;
    const acc = createBufferAccumulator();
    chunks.forEach((c) => acc.push(c));
    const buffer = acc.getBuffer();
    const blob = new Blob([buffer], { type });
    const url = URL.createObjectURL(blob);
    self.postMessage({ id, url });
};
import type { ChunkList } from "../types";
import type { BlobWorkerRequest } from "../types";

// Handle messages from the main thread
self.onmessage = async (e: MessageEvent<BlobWorkerRequest>) => {
  try {
    const { id, chunks, type } = e.data;
    
    // Combine chunks
    const total = chunks.reduce((a, c) => a + c.length, 0);
    const combined = new Uint8Array(total);
    let offset = 0;
    
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }
    
    // Create blob and URL
    const blob = new Blob([combined], { type });
    const url = URL.createObjectURL(blob);
    
    // Send back to main thread
    self.postMessage({ id, url });
  } catch (err) {
    console.error('Worker error:', err);
    self.postMessage({ error: String(err) });
  }
};