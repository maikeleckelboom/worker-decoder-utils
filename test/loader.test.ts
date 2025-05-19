import { loadImageFromFetch } from '../src';

// Mock fetch for test
beforeAll(() => {
    global.fetch = async () => {
        const stream = new ReadableStream({
            start(controller) {
                controller.enqueue(new Uint8Array([137, 80, 78, 71]));
                controller.close();
            }
        });
        return {
            ok: true,
            body: stream,
        } as Response;
    };
});

describe('loadImageFromFetch', () => {
    it('loads image from URL and returns Image', async () => {
        const img = await loadImageFromFetch('/dummy.png');
        expect(img).toBeInstanceOf(HTMLImageElement);
    });
});
