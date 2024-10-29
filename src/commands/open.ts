/**
 * @file Contains the logic used in the open command.
 */

import open from "open";

import { Logger } from "../utils/output/logger.ts";

import {
	find_products_by_name,
	get_desired_product_url,
} from "../utils/products/index.ts";
import { get_products_async } from "../api/methods/get_products_async.ts";
import type { OpenOpts } from "../schema.ts";

export async function open_links_async({ name }: OpenOpts): Promise<void> {
	const { products } = await get_products_async();

	const { found_items, invalid_values } = find_products_by_name(
		[name],
		products
	);

	if (invalid_values.length) {
		Logger.warn(`Links could not be found for: ${invalid_values.join(", ")}`);
	}

	if (found_items.length) {
		for (let i = 0; i < found_items.length; i++) {
			const { name, urls } = found_items[i];
			Logger.log(`Opening link for ${name}...`);
			const url_to_open = get_desired_product_url(urls);
			await open(url_to_open);
		}
	}
}
