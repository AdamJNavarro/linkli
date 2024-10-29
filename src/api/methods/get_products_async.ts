import type { LinkliProduct } from "../../types.ts";
import { CommandError } from "../../utils/output/errors.ts";
import { fetch_async } from "../client.ts";

interface ProductsData {
	products: LinkliProduct[];
	product_names: string[];
}

/**
 * Gets products from Linkli API.
 *
 * @export
 * @async
 * @returns {Promise<ProductsData>}
 */
export async function get_products_async(): Promise<ProductsData> {
	const results = await fetch_async("/products");

	if (!results.ok) {
		throw new CommandError(
			"API",
			`Unexpected response when fetching data from servers: ${results.statusText}.`
		);
	}

	const data = (await results.json()) as LinkliProduct[];

	if (!data.length) {
		throw new CommandError(
			"PRODUCTS",
			"The products list returned from the API is empty."
		);
	}

	const products = data.sort((a, b) => (a.name > b.name ? 1 : -1));

	const product_names = products.map((product) => product.name);

	return { products, product_names };
}
