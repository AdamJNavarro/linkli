/**
 * Determines API url based on env.
 *
 * @export
 * @returns {string}
 */
export function get_api_base_url(): string {
	const url =
		process.env.NODE_ENV === "development"
			? "http://localhost:9009"
			: "https://api.linkli.dev";

	return url;
}
