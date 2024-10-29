import fetch from "node-fetch";
import { URL } from "node:url";

/**
 * Wraps fetch fx with support for a base url. Allows for simply passing endpoints for API calls.
 *
 * @export
 * @param {string} base_url
 * @returns {typeof fetch}
 */
export function build_fetch_with_base_url(base_url: string): typeof fetch {
	return (url, init) => {
		if (typeof url !== "string") {
			throw new TypeError(
				"Base URL fetch function only accepts a string URL as the first parameter"
			);
		}
		const parsed = new URL(url, base_url);

		return fetch(parsed.toString(), init);
	};
}
