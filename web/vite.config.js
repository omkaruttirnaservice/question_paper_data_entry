import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const mode = 'developement';
export default defineConfig({
    plugins: [react()],
    // server: {
    // proxy: {
    //     '/api': {
    //         target: mode == 'developement' ? '' : '',
    //         changeOrigin: true,
    //     },
    // },
    // host: true,
    // open: true,
    // // port: 5002,
    // },
});
