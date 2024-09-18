export default {
	report: {
		previous: "stats/stats.json",
		current: "tmp/stats.json",
	},
	sizes: [
		/**
		 * JavaScript static assets.
		 */
		{
			path: "dist/static/js/index.<hash>.js",
			limit: "7 kb",
			alias: "index.js",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
			alias: "React",
		},
		{
			path: "dist/static/js/lib-router.<hash>.js",
			limit: "21 kb",
			alias: "React Router",
		},
		{
			// path: "dist/static/js/vendors-*uuid*.<hash>.js",
			path: "dist/static/js/344.<hash>.js",
			limit: "53 kb",
			alias: "Static vendors",
		},
		/**
		 * JavaScript static async assets.
		 */
		// {
		// 	path: "dist/static/js/async/*App_App*.<hash>.js",
		// 	limit: "5 kb",
		// 	alias: "App",
		// },
		// {
		// 	path: "dist/static/js/async/node_modules_*ui-components*.<hash>.js",
		// 	limit: "6 kb",
		// 	alias: "UI components loader",
		// },
		// {
		// 	path: "dist/static/js/async/vendors-*node_modules_*ui-components*.<hash>.js",
		// 	limit: "6 kb",
		// 	alias: "UI components",
		// },
		{ path: "dist/static/js/async/315.<hash>.js", limit: "1 kb" },
		{ path: "dist/static/js/async/758.<hash>.js", limit: "2 kb" },
		{ path: "dist/static/js/async/85.<hash>.js", limit: "3 kb" },
		{ path: "dist/static/js/async/807.<hash>.js", limit: "4 kb" },
		{ path: "dist/static/js/async/773.<hash>.js", limit: "4 kb" },
		{ path: "dist/static/js/async/292.<hash>.js", limit: "7 kb" },
		{ path: "dist/static/js/async/135.<hash>.js", limit: "10 kb" },
		{ path: "dist/static/js/async/46.<hash>.js", limit: "8 kb" },
		{ path: "dist/static/js/async/17.<hash>.js", limit: "25 kb" },
		{ path: "dist/static/js/async/891.<hash>.js", limit: "45 kb" },
		{ path: "dist/static/js/async/121.<hash>.js", limit: "130 kb" },
		/**
		 * CSS static assets.
		 */
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
			alias: "index.css",
		},
	],
};
