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
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
		},
		{
			path: "dist/static/js/lib-router.<hash>.js",
			limit: "20 kb",
		},
		{
			path: "dist/static/js/vendors-*uuid*.<hash>.js",
			limit: "43 kb",
		},
		/**
		 * JavaScript static async assets.
		 */
		{
			path: "dist/static/js/async/*App_App*.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/async/vendors-*node_modules_*ui-components*.<hash>.js",
			limit: "6 kb",
		},
		/**
		 * CSS static assets.
		 */
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "11 kb",
		},
	],
};
