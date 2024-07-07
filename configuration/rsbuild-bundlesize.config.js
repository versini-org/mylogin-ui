import { defineConfig } from "@rsbuild/core";

import defaultConfig from "../packages/client/rsbuild.config";

export default defineConfig({
	...defaultConfig,

	tools: {
		rspack: {
			optimization: {
				chunkIds: "named",
				moduleIds: "named",
			},
		},
	},
});
