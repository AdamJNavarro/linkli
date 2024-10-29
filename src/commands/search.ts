/**
 * @file Contains the logic used in the search command.
 */

import open from "open";
import search from "@inquirer/search";

import fuzzysort from "fuzzysort";
import { get_products_async } from "../api/methods/get_products_async.js";
import { get_desired_product_url } from "../utils/products/index.ts";

export async function search_products_async(): Promise<void> {
	const { products } = await get_products_async();

	const answer = await search({
		message: "Search for a product",
		source: async (input) => {
			if (!input) {
				return [];
			}
			const results = fuzzysort.go(input, products, {
				key: "name",
				threshold: 0.75,
			});

			const choices = results.map((result) => ({
				name: result.obj.name,
				value: get_desired_product_url(result.obj.urls),
			}));

			return choices;
		},
	});
	await open(answer);
}
