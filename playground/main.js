import { bufferToBlobUrl } from '../src/index.js';

// DOM elements
const outputEl = document.getElementById('output');
const imageContainer = document.getElementById('imageContainer');

// Logging function
function log(message) {
    console.log(message);
    outputEl.textContent += message + '\n';
}

// Create test data (non-image)
function createTestData() {
    return [new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])];
}

// Create 1x1 black PNG image data
function createTestImage() {
    return [new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83,
        222, 0, 0, 0, 1, 115, 82, 71, 66, 0, 174, 206, 28, 233, 0,
        0, 0, 4, 103, 65, 77, 65, 0, 0, 177, 143, 11, 252, 97, 5,
        0, 0, 0, 9, 112, 72, 89, 115, 0, 0, 14, 195, 0, 0, 14,
        195, 1, 199, 111, 168, 100, 0, 0, 0, 12, 73, 68, 65, 84, 24,
        87, 99, 248, 15, 0, 1, 1, 1, 0, 48, 45, 0, 202, 0, 0,
        0, 0, 73, 69, 78, 68, 174, 66, 96, 130
    ])];
}

// Test with a specific strategy
async function testWithStrategy(strategy) {
    try {
        log(`\nTesting ${strategy} strategy...`);

        // Test regular binary data
        const dataResult = strategy === 'sync'
            ? bufferToBlobUrl(createTestData(), 'application/octet-stream', strategy)
            : await bufferToBlobUrl(createTestData(), 'application/octet-stream', strategy);
        log(`Binary data URL: ${dataResult}`);

        // Test image data
        const imageResult = strategy === 'sync'
            ? bufferToBlobUrl(createTestImage(), 'image/png', strategy)
            : await bufferToBlobUrl(createTestImage(), 'image/png', strategy);
        log(`Image URL: ${imageResult}`);

        // Test image loading and display
        const canLoad = await testImageLoading(imageResult);
        log(`Image loadable: ${canLoad ? 'Yes' : 'No'}`);
        displayImage(imageResult, strategy);

        return { dataResult, imageResult };
    } catch (error) {
        log(`Error: ${error.message}`);
        throw error;
    }
}

// Test image loading
function testImageLoading(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            log(`Image loaded: ${img.width}x${img.height}`);
            resolve(true);
        };
        img.onerror = (e) => {
            log(`Image load failed: ${e}`);
            resolve(false);
        };
        img.src = url;
    });
}

// Display image in DOM
function displayImage(blobUrl, strategy) {
    const img = new Image();
    img.src = blobUrl;
    img.alt = `${strategy} strategy result`;
    img.style.maxWidth = '100%';

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<strong>${strategy} strategy:</strong>`;
    wrapper.appendChild(img);
    imageContainer.appendChild(wrapper);
}

// Setup event listeners
document.getElementById('testSync').addEventListener('click', () => testWithStrategy('sync'));
document.getElementById('testDedicated').addEventListener('click', () => testWithStrategy('dedicated'));
document.getElementById('testShared').addEventListener('click', () => testWithStrategy('shared'));

// E2E test hook
window.runE2ETest = async (strategy) => {
    try {
        const { dataResult, imageResult } = await testWithStrategy(strategy);
        return {
            success: true,
            dataUrl: dataResult,
            imageUrl: imageResult,
            imageLoadable: await testImageLoading(imageResult)
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

log('Playground loaded and ready.');
