import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));

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
        fs: {
            allow: [
                rootDir,
                resolve(rootDir, '../kingmaker-docs/ui'),
            ],
        },
        headers: {
            'Cache-Control': 'no-store',
        },
    },
});
