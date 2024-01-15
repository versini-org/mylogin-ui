/* eslint-disable no-undef */
module.exports = {
	reportOutput: ["github"],
	baseDir: "./packages/client/dist",
	defaultCompression: "gzip",
	files: [
		{
			path: "index.html",
			maxSize: "2kb",
		},
		{
			path: "assets/index-<hash>.js",
			maxSize: "5kb",
		},
		{
			path: "assets/vendor-<hash>.js",
			maxSize: "55kb",
		},
		{
			path: "assets/jsonUtilities-<hash>.js",
			maxSize: "10kb",
		},
		{
			path: "assets/index-<hash>.css",
			maxSize: "8kb",
		},
		{
			path: "assets/**/*.{png,svg}",
		},
	],
};
