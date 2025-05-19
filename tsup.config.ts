import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],           // entry point
    outDir: 'dist',                    // output directory
    format: ['esm', 'cjs'],            // module formats
    dts: true,                         // generate TypeScript declaration files
    splitting: false,                  // disable code splitting for ESM
    sourcemap: true,                   // include sourcemaps
    clean: true,                       // clean output directory before build
    minify: false,                     // skip minification (optional)
    target: 'es2020',                  // JS target
});
