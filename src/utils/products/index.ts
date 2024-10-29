import checkbox from "@inquirer/checkbox";

import type {
	LinkliProduct,
	FootprintKey,
	LinkliProductUrls,
} from "../../types.js";

export function get_desired_product_url(urls: LinkliProductUrls): string {
	if (typeof urls === "string") return urls;
	return urls.docs;
}

export async function find_products_by_footprint(
	values: string[],
	key: FootprintKey,
	products: LinkliProduct[]
): Promise<LinkliProduct[]> {
	let found_items: LinkliProduct[] = [];
	for (let i = 0; i < values.length; i++) {
		const search_value = values[i];

		const matching_items = products.filter(
			(item) => item.footprint[key].indexOf(search_value) !== -1
		);

		if (!matching_items.length) {
			continue;
		}

		if (matching_items.length > 1) {
			const prompt_msg = `Conflict found for ${search_value}. Please select the appropriate product(s).`;
			const prompt_choices = matching_items.map((item) => ({
				name: item.name,
				value: item.name,
			}));
			const answer = await checkbox({
				message: prompt_msg,
				choices: prompt_choices,
			});
			// No choices selected by user so continue the loop
			if (!answer.length) {
				continue;
			}

			// All choices selected by user so add all items and continue;
			if (answer.length === matching_items.length) {
				found_items = [...found_items, ...matching_items];
				continue;
			}

			// Some choices selected by user so filter matching items for selections
			const selected_items = matching_items.filter(
				(item) => answer.indexOf(item.name) !== -1
			);
			found_items = [...found_items, ...selected_items];
			continue;
		}

		const only_matched_item = matching_items[0];
		found_items.push(only_matched_item);
	}
	return found_items;
}

type ProductSearchByNameResult = {
	found_items: LinkliProduct[];
	invalid_values: string[];
};

export function find_products_by_name(
	values: string[],
	products: LinkliProduct[]
): ProductSearchByNameResult {
	const found_items: LinkliProduct[] = [];
	const invalid_values: string[] = [];
	for (let i = 0; i < values.length; i++) {
		const search_value = values[i];
		const matching_item = products.find((item) => item.name === search_value);
		if (matching_item) {
			found_items.push(matching_item);
		} else {
			invalid_values.push(search_value);
		}
	}
	return { found_items, invalid_values };
}
