/**
 * @file Contains the logic used in the list command.
 */

import { Logger } from "../utils/output/logger.ts";
import {
	find_collection_file,
	get_collection,
	get_names_from_project_collection,
} from "../utils/filesys/collection.ts";
import { get_collection_output } from "../utils/output/collection.ts";
import { find_project_root } from "../utils/filesys/project-root.ts";
import { get_products_async } from "../api/methods/get_products_async.ts";
import { get_all_products_list_output } from "../utils/output/products.ts";
import type { ListOpts } from "../schema.ts";

export async function list_products_async(options: ListOpts): Promise<void> {
	const { all, raw } = options;
	let collection_found = false;
	let collection: any = {};

	const { product_names } = await get_products_async();

	// If all flag passed, dont check for local project
	if (all) {
		const output = get_all_products_list_output(product_names);
		Logger.exit(output, 0);
	}

	// See if cmd was run within a initialized project
	const project_root = find_project_root(process.cwd());
	if (project_root) {
		// project found...now check for collection
		collection_found = find_collection_file(project_root);

		if (collection_found) {
			collection = get_collection(project_root);
		}
	}

	// If raw flag passed, create output for amazon Q autocomplete generator
	if (raw) {
		const collection_names = collection_found
			? get_names_from_project_collection(collection)
			: { product_names: [], custom_names: [] };

		const official_names = collection_names.product_names.length
			? product_names.filter(
					(name) => collection_names.product_names.indexOf(name) === -1
				)
			: product_names;

		const raw_output = `${collection_names.product_names.join(",")}\n${official_names.join(",")}`;
		Logger.exit(raw_output, 0);
	}

	// if collection found, only display said collection
	if (collection_found) {
		const output = get_collection_output({ collection });
		Logger.exit(output, 0);
	}

	// fallback to official stack output
	const output = get_all_products_list_output(product_names);
	Logger.exit(output, 0);
}
