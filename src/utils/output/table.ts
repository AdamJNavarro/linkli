import Table, { type CellOptions } from "cli-table3";
import { OUTPUT_INDENT } from "./index.js";

interface BuildOutputTableArgs {
	rows: string[][];
	opts: Table.TableConstructorOptions;
}

export type _CellOptions = CellOptions & {
	wordWrap?: boolean;
};

export const no_border_chars = {
	top: "",
	"top-mid": "",
	"top-left": "",
	"top-right": "",
	bottom: "",
	"bottom-mid": "",
	"bottom-left": "",
	"bottom-right": "",
	left: "",
	"left-mid": "",
	mid: "",
	"mid-mid": "",
	right: "",
	"right-mid": "",
	middle: "",
};

export const default_table_opts: Table.TableConstructorOptions = {
	chars: no_border_chars,
	style: {
		"padding-left": 0,
		"padding-right": 2,
	},
};

const alignMap = {
	l: "left",
	c: "center",
	r: "right",
} as const;

export function build_output_table({
	rows,
	opts,
}: BuildOutputTableArgs): string {
	const merged_opts = Object.assign({}, default_table_opts, opts);
	console.log("merged_opts", merged_opts);

	const table = new Table(merged_opts);
	table.push(
		...rows.map((row) =>
			row.map((cell, i) => ({
				content: cell,
				hAlign: alignMap.l,
			}))
		)
	);
	return table.toString();
}

// Use the word wrapping ability of cli-table3
// by creating a one row, one cell, one column table.
// This allows us to avoid pulling in the word-wrap
// package which ironically seems to do a worse job.
export function build_wrapping_output_table(text: string, maxWidth: number) {
	const _tableOptions = Object.assign({}, default_table_opts, {
		colWidths: [maxWidth],
		style: {
			"padding-left": OUTPUT_INDENT.length,
		},
	});
	const table = new Table(_tableOptions);
	table.push([
		{
			content: text,
			wordWrap: true,
		} as _CellOptions,
	]);

	return table.toString();
}
