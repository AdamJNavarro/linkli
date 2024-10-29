export function get_all_products_list_output(product_names: string[]): string {
	return `\n${product_names.join(", ")}`;
}
