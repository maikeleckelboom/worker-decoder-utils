import type { Chunk, ChunkList } from "../types";
import { createBufferAccumulator } from "../utils/accumulator";
import { bufferToBlobUrl } from "../utils/blob";
import type { ImageElement } from "../types";
import { streamChunks } from "../utils/streamChunks";

export async function loadImageFromFetch(
    url: string
): Promise<ImageElement> {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
        throw new Error("Failed to fetch image");
    }

    const accumulator = createBufferAccumulator();
    await streamChunks(response.body as ReadableStream<Uint8Array>, accumulator.push);

    const buffer = accumulator.getBuffer();
    const blobUrl = bufferToBlobUrl(buffer);
    return await new Promise<ImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = blobUrl;
    });
}
