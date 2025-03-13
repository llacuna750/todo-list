import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    base: '/todo-list/',  // Make sure this matches your GitHub repo name
    server: {
        port: parseInt(process.env.VITE_PORT) || 5173,
    },
    build: {
        outDir: 'dist',
    },
});