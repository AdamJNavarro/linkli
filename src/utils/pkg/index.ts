import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { packageDirectory } from "pkg-dir";

const get_cli_pkg = async () => {
	const pkg_dir = await packageDirectory();

	if (!pkg_dir) {
		throw new Error("Pkg dir could not be found.");
	}

	const package_json_path = join(pkg_dir, "package.json");
	// @ts-expect-error TS(2345) FIXME: Argument of type 'Buffer' is not assignable to par... Remove this comment to see the full error message
	const package_json = JSON.parse(await readFile(package_json_path));

	return package_json;
};

export default get_cli_pkg;
