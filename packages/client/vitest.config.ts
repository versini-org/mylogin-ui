/// <reference types="vitest" />

import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config";

export default mergeConfig(
	viteConfig,
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
