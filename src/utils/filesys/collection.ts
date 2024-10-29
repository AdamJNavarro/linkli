import { join } from "node:path";

import { existsSync } from "node:fs";
import JsonFile from "./json.js";
import type { LinkliCollection, LinkliProduct } from "../../types.js";
import { CommandError } from "../output/errors.js";
import { find_project_root_or_assert } from "./project-root.js";
import { DOT_DIR_NAME, GEN_FILE_NAME } from "../../constants.js";

export function get_collection_or_assert(cwd: string): LinkliCollection {
	const project_root = find_project_root_or_assert(cwd);
	const collection_path = get_root_collection_path(project_root);
	if (!existsSync(collection_path)) {
		throw new CommandError(
			"PROJECT",
			`Collection not found (working dir: ${project_root})`
		);
	}
	const collection = JsonFile.read(collection_path);

	return collection as any;
}

export function find_collection_file(project_root: string): boolean {
	const collection_path = get_root_collection_path(project_root);
	return existsSync(collection_path);
}

export function get_collection(project_root: string): LinkliCollection {
	const [collection] = get_collection_and_path(project_root);
	return collection;
}

export function get_collection_and_path(
	project_root: string
): [LinkliCollection, string] {
	const collection_path = get_root_collection_path(project_root);
	const collection = JsonFile.read(collection_path);
	return [collection as any, collection_path];
}

export function get_root_collection_path(project_root: string): string {
	return join(project_root, `${DOT_DIR_NAME}/${GEN_FILE_NAME}`);
}

export function get_names_from_project_collection(
	collection: LinkliCollection
): { product_names: string[]; custom_names: string[] } {
	const product_names = get_product_names_from_collection(collection);
	if (collection.custom) {
		const custom_names = Object.keys(collection.custom);
		return { product_names, custom_names };
	}
	return { product_names, custom_names: [] };
}

export function get_product_names_from_collection(
	collection: LinkliCollection
): string[] {
	return collection.products.map((product) => product.name);
}

interface GenerateCollectionFileArgs {
	project_root: string;
	products: LinkliProduct[];
}

export async function generate_collection_file({
	project_root,
	products,
}: GenerateCollectionFileArgs) {
	const collection_path = get_root_collection_path(project_root);

	const prepared_products = products
		.map((product) => ({ name: product.name, urls: product.urls }))
		.sort((a, b) => (a.name > b.name ? 1 : -1));

	const collection_json = {
		created_at: new Date().toISOString(),
		products: prepared_products,
	};
	if (existsSync(collection_path)) {
		const custom = await JsonFile.getAsync(collection_path, "custom", null);
		if (custom) {
			// merge
			Object.assign(collection_json, { custom });
		}
	}

	return await JsonFile.writeAsync(collection_path, collection_json, {
		ensureDir: true,
	});
}
