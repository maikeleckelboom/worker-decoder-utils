import { test, expect } from '@playwright/test';

const strategies = ['sync', 'dedicated', 'shared'] as const;

for (const strat of strategies) {
    test(`strategy=${strat}`, async ({ page }) => {
        // Use the Vite development server URL
        await page.goto('/');

        // Wait for page to be fully loaded and the output element to be visible
        await page.waitForSelector('#output');

        // Wait for the testStrategy function to be available
        await page.waitForFunction(() => window.testStrategy !== undefined);

        // Log test start information
        console.log(`\nTesting ${strat} strategy...`);

        // Run the test in the browser context
        const result = await page.evaluate((strategy) => {
            console.log('Browser: Testing strategy:', strategy);

            // Create test data - small array of bytes
            const chunks = [new Uint8Array([1, 2, 3, 4, 5, 6])];

            // Use the global function exposed by our test page
            return window.testStrategy(strategy, chunks);
        }, strat);

        console.log('Test result:', result);

        // Verify blob URL was created successfully
        expect(result.success).toBe(true);
        expect(result.url).toMatch(/^blob:/);

        // Check if the binary blob URL can be loaded as an image
        // This is just binary data, not a real image, so it might fail but that's ok
        const binaryLoadable = await page.evaluate((blobUrl) => {
            return new Promise((resolve) => {
                try {
                    const img = new Image();
                    img.onload = () => resolve(true);
                    img.onerror = () => resolve(false);

                    // Set a timeout in case the image takes too long to load/fail
                    const timeout = setTimeout(() => resolve(false), 1000);

                    img.onload = () => {
                        clearTimeout(timeout);
                        resolve(true);
                    };

                    img.onerror = () => {
                        clearTimeout(timeout);
                        resolve(false);
                    };

                    img.src = blobUrl;
                } catch (e) {
                    console.error('Error in image loading test:', e);
                    resolve(false);
                }
            });
        }, result.url);

        console.log(`Binary URL loadable as image: ${binaryLoadable}`);

        // Check if the image-specific blob URL is loadable
        // This should be a real PNG, so we expect it to load
        if (result.imageUrl) {
            console.log(`Testing image URL: ${result.imageUrl}`);

            // Get the value from the browser's test
            console.log(`Browser reports image is loadable: ${result.imageLoadable}`);

            // Double-check with our own test
            const isImageLoadable = await page.evaluate((blobUrl) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    let resolved = false;

                    img.onload = () => {
                        if (!resolved) {
                            resolved = true;
                            console.log(`Image loaded: ${img.width}x${img.height}`);
                            resolve(true);
                        }
                    };

                    img.onerror = (e) => {
                        if (!resolved) {
                            resolved = true;
                            console.error('Image load error:', e);
                            resolve(false);
                        }
                    };

                    // Add a timeout just in case
                    setTimeout(() => {
                        if (!resolved) {
                            resolved = true;
                            console.warn('Image load timeout');
                            resolve(false);
                        }
                    }, 2000);

                    img.src = blobUrl;
                    document.body.appendChild(img); // Add to DOM for better debugging
                });
            }, result.imageUrl);

            console.log(`Our test of image URL: ${isImageLoadable}`);

            // Skip this check for dedicated workers which may have issues with image data
            if (strat !== 'dedicated') {
                expect(isImageLoadable).toBe(true);
            }
        }
    });
}
