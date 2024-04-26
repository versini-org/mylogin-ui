import fs from "fs-extra";
import { defineConfig } from "vite";

const packageJson = fs.readJSONSync("package.json");
const reactVersion = packageJson.dependencies.react;

const REACT_CHUNK = "reactChunk";

const buildTime = new Date()
	.toLocaleString("en-US", {
		timeZone: "America/New_York",
		timeZoneName: "short",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	})
	.replace(/,/g, "");

export default defineConfig({
	build: {
		modulePreload: {
			polyfill: false,
		},
		rollupOptions: {
			output: {
				/**
				 * Manually creating chunks for React and heavy libraries.
				 */
				manualChunks: {
					[REACT_CHUNK]: [
						"react",
						"react/jsx-runtime",
						"react-dom",
						"react-dom/server",
					],
				},
				/**
				 * By default, manual chucks (created above), will
				 * have a hash appended to their name, as in:
				 * react-C97E4lKa.js
				 * It's ok for most chunks since they change often,
				 * but for React for example, it's better to simply
				 * call that chunk "react-18.2.0.js". (the version is
				 * the only dynamic part coming from the package.json
				 * file itself), so that it is cached in browsers as
				 * much as possible.
				 */
				chunkFileNames(chunkInfo) {
					if (chunkInfo.name.includes(REACT_CHUNK)) {
						return `react-${reactVersion}.js`;
					}

					return "index-[hash].js";
				},
			},
		},
	},
	esbuild: {
		supported: {
			"top-level-await": true, //browsers can handle top-level-await features
		},
	},
	define: {
		"import.meta.env.BUILDTIME": JSON.stringify(buildTime),
		"import.meta.env.BUILDVERSION": JSON.stringify(packageJson.version),
	},
	plugins: [],
});
