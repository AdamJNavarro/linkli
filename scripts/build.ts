import ts from "typescript";
import path from "node:path";
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";

function parse_ts_config(tsconfig_path) {
	const parsed_config = ts.readConfigFile(tsconfig_path, ts.sys.readFile);
	if (parsed_config.error) {
		console.error(
			"Error parsing tsconfig:",
			ts.flattenDiagnosticMessageText(parsed_config.error.messageText, "\n")
		);
		return;
	}

	const result = ts.parseJsonConfigFileContent(
		parsed_config.config,
		ts.sys,
		path.dirname(tsconfig_path)
	);
	if (result.errors && result.errors.length > 0) {
		for (const error of result.errors) {
			console.error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
		}
		return;
	}
	return result;
}

async function build_cli(cwd = process.cwd()) {
	const config_path = path.join(cwd, "tsconfig.build.json");
	const tsconfig = parse_ts_config(config_path);

	if (!tsconfig) {
		throw new Error(`Failed to load "${config_path}`);
	}

	const entryPoints = [path.join(cwd, "src/index.ts")];

	const outdir = tsconfig.options.outDir;

	const pkg_json_path = path.join(process.cwd(), "package.json");
	const pkg_json = JSON.parse(readFileSync(pkg_json_path, "utf8"));
	const externals = Object.keys(pkg_json.dependencies || {});

	await build({
		entryPoints,
		format: "esm",
		outdir,
		platform: "node",
		target: "esnext",
		sourcemap: tsconfig.options.sourceMap,
		bundle: true,
		external: externals,
		banner: {
			js: "#!/usr/bin/env node",
		},
	});

	pkg_json.devDependencies = undefined;
	pkg_json.scripts = undefined;
	pkg_json.ava = undefined;

	const dist_pkg_json_path = path.join("./dist", "package.json");

	writeFileSync(dist_pkg_json_path, JSON.stringify(pkg_json, null, 2));
}

await build_cli();
