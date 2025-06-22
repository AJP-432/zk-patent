import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
	optimizeDeps: {
		exclude: ['pdf-parse']
	},
	ssr: {
		noExternal: ['snarkjs', 'ffjavascript'],
		external: ['pdf-parse']
	}
});
