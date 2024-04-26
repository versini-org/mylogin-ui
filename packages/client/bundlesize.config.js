export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/assets/index-<hash>.js",
			limit: "17 kb",
		},
		{
			path: "dist/assets/index-<hash>.css",
			limit: "9 kb",
		},
		{
			path: "dist/index-<hash>.js",
			limit: "16 kb",
		},
		{
			path: "dist/react-<semver>.js",
			limit: "46 kb",
		},
	],
};
