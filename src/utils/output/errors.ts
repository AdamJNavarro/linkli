import { AssertionError } from "node:assert";
import chalk from "chalk";
import { Logger } from "./logger.js";

const ERROR_PREFIX = "Error: ";

type CommandErrorCodes =
	| "PROJECT"
	| "API"
	| "BAD_ARGS"
	| "PRODUCTS"
	| "ABORTED";

export class CommandError extends Error {
	name = "CommandError";
	readonly isCommandError = true;

	constructor(
		public code: CommandErrorCodes,
		message = ""
	) {
		super("");
		let local_msg = message;
		// If e.toString() was called to get `message` we don't want it to look
		// like "Error: Error:".
		if (message.startsWith(ERROR_PREFIX)) {
			local_msg = message.substring(ERROR_PREFIX.length);
		}

		this.message = local_msg || code;
	}
}

export class AbortCommandError extends CommandError {
	constructor() {
		super("ABORTED", "Interactive prompt was cancelled.");
	}
}

export function log_cmd_error(error: any): any {
	if (!(error instanceof Error)) {
		throw error;
	}
	if (error instanceof AbortCommandError) {
		// Do nothing, this is used for prompts or other cases that were custom logged.
		process.exit(0);
	} else if (error instanceof CommandError || error instanceof AssertionError) {
		// Print the stack trace in debug mode only.
		Logger.exit(error);
	}

	const errorDetails = error.stack ? `\n${chalk.gray(error.stack)}` : "";

	Logger.exit(chalk.red(error.toString()) + errorDetails);
}
