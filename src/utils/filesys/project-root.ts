import path from "node:path";
import { glob } from "glob";
import { CommandError } from "../output/errors.js";
import { resolve_json_file_from_silently } from "./index.js";

export function find_project_root_or_assert(cwd: string): string {
	const project_root = find_project_root(cwd);
	if (!project_root) {
		throw new CommandError(
			"PROJECT",
			`Project root directory not found (working dir: ${cwd})`
		);
	}
	return project_root;
}

export function find_project_root(cwd: string): string | null {
	const found = resolve_json_file_from_silently(cwd, "./package.json");
	if (found) return path.dirname(found);

	const parent = path.dirname(cwd);
	if (parent === cwd) return null;

	return find_project_root(parent);
}

export async function get_project_root_contents_async(
	dir: string
): Promise<string[]> {
	const items = await glob(["*", ".github/*"], {
		cwd: dir,
		dot: true,
		ignore: ["node_modules/**", "*.md", "package.*"],
	});

	return items.sort((a, b) => (a > b ? 1 : -1));
}
