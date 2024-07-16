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
			limit: "6 kb",
			alias: "index.js",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
			alias: "React",
		},
		{
			path: "dist/static/js/lib-router.<hash>.js",
			limit: "20 kb",
			alias: "React Router",
		},
		{
			path: "dist/static/js/vendors-*uuid*.<hash>.js",
			limit: "53 kb",
			alias: "Static vendors",
		},
		/**
		 * JavaScript static async assets.
		 */
		{
			path: "dist/static/js/async/*App_App*.<hash>.js",
			limit: "5 kb",
			alias: "App",
		},
		{
			path: "dist/static/js/async/node_modules_*ui-components*.<hash>.js",
			limit: "6 kb",
			alias: "UI components loader",
		},
		{
			path: "dist/static/js/async/vendors-*node_modules_*ui-components*.<hash>.js",
			limit: "6 kb",
			alias: "UI components",
		},
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
