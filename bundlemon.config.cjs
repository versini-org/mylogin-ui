/* eslint-disable no-undef */
module.exports = {
	reportOutput: ["github"],
	baseDir: "./packages/client/dist",
	defaultCompression: "gzip",
	files: [
		{
			path: "index.html",
			maxSize: "2kb",
			maxPercentIncrease: 5,
		},
		{
			path: "assets/index-<hash>.js",
			maxSize: "65kb",
		},
		{
			path: "assets/jsonUtilities--<hash>.js",
			maxSize: "10kb",
		},
		{
			path: "assets/index-<hash>.css",
			maxSize: "3kb",
		},
		{
			path: "assets/**/*.{png,svg}",
		},
	],
};
