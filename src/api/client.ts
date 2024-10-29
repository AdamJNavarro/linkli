import { build_fetch_with_base_url } from "../utils/network/fetch.ts";
import { get_api_base_url } from "./endpoints.ts";

export const fetch_async = build_fetch_with_base_url(`${get_api_base_url()}`);
