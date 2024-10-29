/**
 * @file Contains constants to be reused throughout the CLI source code.
 */

export const CLI_NAME: string = "linkli" as const;
export const CLI_LOGO: string = "🔗" as const;
export const CLI_DIR: string = ".linkli" as const;
export const DOT_DIR_NAME: string = `.${CLI_NAME}` as const;
export const GEN_FILE_NAME: string = "collection.json" as const;

export const OFFICIAL_PKG_JSON_KEYS: string[] = [
	"name",
	"description",
	"version",
	"private",
	"scripts",
	"type",
	"types",
	"dependencies",
	"devDependencies",
	"optionalDependencies",
	"peerDependencies",
	"bundleDependencies",
	"peerDependenciesMeta",
	"repository",
	"keywords",
	"author",
	"license",
	"bugs",
	"homepage",
	"publishConfig",
	"module",
	"files",
	"packageManager",
	"main",
	"overrides",
	"resolutions",
	"funding",
	"bin",
	"man",
	"directories",
	"os",
	"cpu",
	"workspaces",
	"engines",
	"browser",
	"config",
	"preferGlobal",
] as const;
