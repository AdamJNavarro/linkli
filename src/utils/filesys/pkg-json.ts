import { join } from "node:path";

import { existsSync } from "node:fs";
import { CommandError } from "../output/errors.js";
import JsonFile from "./json.js";
import { OFFICIAL_PKG_JSON_KEYS } from "../../constants.js";

export function get_package_json(project_root: string): any {
	const [pkg] = get_package_json_and_path(project_root);
	return pkg;
}

function get_package_json_and_path(project_root: string): [any, string] {
	const package_json_path = get_root_package_json_path(project_root);
	const pkg = JsonFile.read(package_json_path);
	return [pkg, package_json_path];
}

export function get_root_package_json_path(project_root: string): string {
	const package_json_path = join(project_root, "package.json");
	if (!existsSync(package_json_path)) {
		throw new CommandError(
			"PROJECT",
			`The expected package.json path: ${package_json_path} does not exist`
		);
	}
	return package_json_path;
}

export function get_unofficial_pkg_json_keys(pkg: JSON): string[] {
	return Object.keys(pkg)
		.filter((objKey) => !OFFICIAL_PKG_JSON_KEYS.includes(objKey))
		.sort((a, b) => (a > b ? 1 : -1));
}
