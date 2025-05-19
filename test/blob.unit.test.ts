import { bufferToBlobUrl } from '../src/buffer';

const dummy = new Uint8Array([1, 2, 3]);

describe('bufferToBlobUrl', () => {
    it('creates URL from sync strategy', () => {
        const url = bufferToBlobUrl([dummy], 'application/octet-stream', 'sync');
        expect(url.startsWith('blob:')).toBe(true);
    });

    it('creates URL from dedicated worker', async () => {
        const url = await bufferToBlobUrl([dummy], 'application/octet-stream', 'dedicated');
        expect(url.startsWith('blob:')).toBe(true);
    });

    it('creates URL from shared worker', async () => {
        const url = await bufferToBlobUrl([dummy], 'application/octet-stream', 'shared');
        expect(url.startsWith('blob:')).toBe(true);
    });
});
