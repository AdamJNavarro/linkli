/**
 * @file Contains the logic used in the generate command.
 */

import { Logger } from "../utils/output/logger.ts";
import {
	find_project_root_or_assert,
	get_project_root_contents_async,
} from "../utils/filesys/project-root.ts";
import { generate_collection_file } from "../utils/filesys/collection.ts";
import {
	get_package_json,
	get_unofficial_pkg_json_keys,
} from "../utils/filesys/pkg-json.ts";
import { get_products_async } from "../api/methods/get_products_async.ts";
import { find_products_by_footprint } from "../utils/products/index.ts";
import type { LinkliProduct } from "../types.ts";

export async function generate_collection_async(): Promise<void> {
	let found_products: LinkliProduct[] = [];
	const project_root = find_project_root_or_assert(process.cwd());

	const pkg_json = get_package_json(project_root);

	const { products } = await get_products_async();

	Logger.log("Generating project collection...");

	Logger.log("Checking package.json for unofficial keys...");

	const unofficial_keys = get_unofficial_pkg_json_keys(pkg_json);

	if (unofficial_keys.length) {
		const pkg_json_key_products = await find_products_by_footprint(
			unofficial_keys,
			"pkg_json_keys",
			products
		);
		found_products = [...found_products, ...pkg_json_key_products];
	} else {
		Logger.warn("No unofficial pkg.json keys found");
	}

	Logger.log("Checking root dir for configs...");

	const project_root_file_names =
		await get_project_root_contents_async(project_root);

	const files_products = await find_products_by_footprint(
		project_root_file_names,
		"files",
		products
	);

	found_products = [...found_products, ...files_products];

	if (found_products.length) {
		// create collection
		const unique_products = [
			...new Map(found_products.map((item) => [item.name, item])).values(),
		];

		const sorted_found_names = unique_products
			.sort((a, b) => (a.name > b.name ? 1 : -1))
			.map((item) => item.name);

		Logger.log(
			`Links found for the following in your project: ${sorted_found_names.join(
				", "
			)}`
		);

		await generate_collection_file({ project_root, products: unique_products });
	} else {
		// who knows
	}
}
