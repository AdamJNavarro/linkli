import chalk from "chalk";
import {
	line_to_string,
	output_array_to_string,
	OUTPUT_INDENT,
	OUTPUT_NEWLINE,
} from "./index.js";
import type { LinkliCollection } from "../../types.js";
import { get_names_from_project_collection } from "../filesys/collection.js";

function build_collection_group_line(label: string, names: string[]) {
	if (!names.length) return null;

	const output_array: string[] = [
		`${OUTPUT_INDENT}${chalk.dim(`${label}`)}`,
		OUTPUT_NEWLINE,
	];

	const only_names_line = [OUTPUT_INDENT, OUTPUT_INDENT, names.join(", ")];
	output_array.push(line_to_string(only_names_line));
	return output_array_to_string(output_array);
}

interface GetCollectionOutputArgs {
	collection: LinkliCollection;
}

export function get_collection_output({ collection }: GetCollectionOutputArgs) {
	const { product_names, custom_names } =
		get_names_from_project_collection(collection);

	const output_arr: (string | null)[] = [
		"",
		build_collection_group_line("Products", product_names),
		OUTPUT_NEWLINE,
		build_collection_group_line("Custom", custom_names),
		"",
	];

	return output_array_to_string(output_arr);
}
