import { defineConfig } from 'vite';

export default defineConfig({
    base: '/', // Required for GitHub Pages
    build: {
        outDir: 'dist' // Default output directory
    },
});