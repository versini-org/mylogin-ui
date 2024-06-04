/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vitest/config";

export default mergeConfig(
	{},
	defineConfig({
		test: {
			globals: true,
			setupFiles: ["./vitest.setup.ts"],
			environment: "jsdom",
			coverage: {
				provider: "v8",
				lines: 55,
				functions: 30,
				branches: 60,
				statements: 55,
			},
		},
	}),
);
