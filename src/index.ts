/**
 * @file The main entry point and executable for the CLI.
 */

import { run } from "@drizzle-team/brocli";
import { generate, init, list, open, search } from "./schema.ts";
import get_cli_pkg from "./utils/pkg/index.ts";
import { CLI_NAME } from "./constants.ts";

run([generate, init, list, open, search], {
	name: CLI_NAME,
	version: async () => {
		const pkg = await get_cli_pkg();
		console.log(pkg.version);
	},
});
