export type Chunk = Uint8Array;
export type ChunkList = Chunk[];

export interface BlobWorkerRequest {
    id: number;
    chunks: ChunkList;
    type: string;
}

export type ImageElement = HTMLImageElement;
