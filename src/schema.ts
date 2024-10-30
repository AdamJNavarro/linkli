/**
 * @file Contains the commands available in the CLI.
 */

import {
	boolean,
	command,
	positional,
	type TypeOf,
} from "@drizzle-team/brocli";

export const init = command({
	name: "init",
	desc: "Initializes linkli in a project.",
	handler: async () => {
		const { init_project_async } = await import("./commands/init.ts");
		await init_project_async();
		const { generate_collection_async } = await import(
			"./commands/generate.ts"
		);
		await generate_collection_async();
	},
});

export const generate = command({
	name: "generate",
	desc: "Generates a collection of links for a project.",
	handler: async () => {
		const { generate_collection_async } = await import(
			"./commands/generate.ts"
		);
		await generate_collection_async();
	},
});

const list_opts = {
	all: boolean().desc("Show all product names available.").default(false),
	raw: boolean()
		.desc("Used to provide output for Amazon Q.")
		.default(false)
		.hidden(),
};

export type ListOpts = TypeOf<typeof list_opts>;

export const list = command({
	name: "list",
	desc: "List product names.",
	options: list_opts,
	handler: async (opts) => {
		const { list_products_async } = await import("./commands/list.ts");
		await list_products_async(opts);
	},
});

const open_opts = {
	name: positional().desc("Name of product to open link for.").required(),
};

export type OpenOpts = TypeOf<typeof open_opts>;

export const open = command({
	name: "open",
	desc: "Opens a link for the given product.",
	options: open_opts,
	handler: async (opts) => {
		const { open_links_async } = await import("./commands/open.ts");
		await open_links_async(opts);
	},
});

export const search = command({
	name: "search",
	desc: "Search supported product names.",
	handler: async () => {
		const { search_products_async } = await import("./commands/search.ts");
		await search_products_async();
	},
});
