import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { join } from 'path';

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			layout: {
				_: join(import.meta.dirname, './src/lib/components/MarkdownLayout.svelte')
			}
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			'$lib/*': './src/lib/*'
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
