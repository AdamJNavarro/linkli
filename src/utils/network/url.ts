import { fetch_async } from "../../api/client.js";

/**
 * Performs fetch on provided url to check if response is OK.
 *
 * @export
 * @async
 * @param {string} url
 * @returns {Promise<boolean>}
 */
export async function is_url_ok(url: string): Promise<boolean> {
	try {
		const res = await fetch_async(url);
		return res.ok;
	} catch {
		return false;
	}
}
