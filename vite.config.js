import { defineConfig } from 'vite';

export default defineConfig({
    base: '/CCL1/', // Required for GitHub Pages
    build: {
        outDir: 'dist' // Default output directory
    },
});