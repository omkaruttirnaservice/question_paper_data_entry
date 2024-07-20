import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:3026/',
				changeOrigin: true,
			},
		},
		host: 'localhost',
		open: true,
		port: 3000,
	},
});
