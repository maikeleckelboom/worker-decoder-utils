// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./test/setup.ts'],
        include: ['**/*.unit.test.ts'],
        environmentOptions: {
            happyDOM: {
                // Enable to support modern web features
                settings: {
                    enableWebWorker: true,
                }
            }
        },
        // Set a longer timeout for worker tests
        testTimeout: 10000,
    },
});
