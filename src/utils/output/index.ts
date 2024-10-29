export const OUTPUT_INDENT = " ".repeat(2);
export const OUTPUT_NEWLINE = "\n";

// Insert spaces in between non-whitespace items only
export function line_to_string(line: string[]) {
	let string = "";
	for (let i = 0; i < line.length; i++) {
		if (i === line.length - 1) {
			string += line[i];
		} else {
			const curr = line[i];
			const next = line[i + 1];
			string += curr;
			if (curr.trim() !== "" && next.trim() !== "") {
				string += " ";
			}
		}
	}
	return string;
}

export function output_array_to_string(outputArray: (string | null)[]) {
	return outputArray.filter((line) => line !== null).join(OUTPUT_NEWLINE);
}
