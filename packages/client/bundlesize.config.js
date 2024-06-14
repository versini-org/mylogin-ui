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
			limit: "5 kb",
		},
		{
			path: "dist/static/js/lib-react.<hash>.js",
			limit: "45 kb",
		},
		{
			path: "dist/static/js/vendors-*auth-provider*.<hash>.js",
			limit: "9 kb",
		},
		/**
		 * JavaScript static async assets.
		 */
		{
			path: "dist/static/js/async/*App_App*.<hash>.js",
			limit: "5 kb",
		},
		{
			path: "dist/static/js/async/vendors-*uuid*.<hash>.js",
			limit: "8 kb",
		},
		{
			path: "dist/static/js/async/vendors-*ui-components*.<hash>.js",
			limit: "20 kb",
		},
		/**
		 * CSS static assets.
		 */
		{
			path: "dist/static/css/index.<hash>.css",
			limit: "9 kb",
		},
	],
};
