import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["testing/vitest/**/*.test.ts"],
		isolate: true,
		typecheck: {
			tsconfig: "tsconfig.json",
		},
		testTimeout: 100000,
		hookTimeout: 100000,
	},
	plugins: [tsconfigPaths()],
});
