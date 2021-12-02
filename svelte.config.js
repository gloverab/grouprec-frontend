import preprocess from 'svelte-preprocess';
import windicss from 'vite-plugin-windicss';
import path from 'path';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		// By default, `npm run build` will create a standard Node app.
		// You can create optimized builds for different platforms by
		// specifying a different adapter

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		adapter: vercel(),

		vite: {
			resolve: {
				alias: {
					$src: path.resolve('src'),
					$components: path.resolve('src/components'),
					$stores: path.resolve('src/stores'),
					$assets: path.resolve('src/assets')
				}
			},
			plugins: [
				windicss.default({ transformCSS: 'pre' })
			]
		}
	}
};

export default config;
