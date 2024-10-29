import { homedir } from "node:os";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve } from "node:path";

import path from "node:path";
import { DOT_DIR_NAME } from "../../constants.js";

const require = createRequire(import.meta.url);

export function get_cli_home_dir(): string {
	const home_dir = homedir();

	return path.join(home_dir, DOT_DIR_NAME);
}

function resolve_to_file_url(...paths: string[]) {
	return pathToFileURL(resolve(...paths));
}

export function resolve_json_file_from_silently(
	from_dir: string,
	module_id: string
): string | undefined {
	try {
		const local_module_path = resolve_to_file_url(from_dir, module_id);
		const file_path = fileURLToPath(local_module_path);
		require(file_path);
		return file_path;
	} catch (error) {
		return undefined;
	}
}
