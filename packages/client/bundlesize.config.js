export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
			alias: "Initial CSS",
		},
		{
			path: "dist/static/js/index.<hash>.js",
			limit: "123 kb",
			alias: "Initial JS",
		},
		{
			path: "dist/static/js/async/LazyApp.<hash>.js",
			limit: "48 kb",
			alias: "Lazy App JS",
		},
		{
			path: "dist/static/js/async/LazySassySaint.<hash>.js",
			limit: "26 kb",
			alias: "Lazy SassySaint JS",
		},
	],
};
