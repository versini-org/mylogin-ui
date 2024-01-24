export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/index.html",
			limit: "2 kb",
		},
		{
			path: "dist/assets/index-<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/assets/vendor-<hash>.js",
			limit: "55 kb",
		},
		{
			path: "dist/assets/jsonUtilities-<hash>.js",
			limit: "10 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "8 kb",
		},
	],
};
