import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        dedupe: ['lit'],
    },
    optimizeDeps: {
        exclude: ['@salsafx/ui'],
        include: [
            'lit',
            'lit/decorators.js',
        ],
    },
    server: {
        port: 5173,
        strictPort: true,
        open: true,
        headers: {
            'Cache-Control': 'no-store',
        },
    },
});
