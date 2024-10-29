import chalk from "chalk";

export function error(...message: string[]): void {
	console.error(...message);
}

/** Print an error and provide additional info (the stack trace) in debug mode. */
export function exception(e: Error): void {
	error(chalk.red(e.toString()));
}

export function warn(...message: string[]): void {
	console.warn(...message.map((value) => chalk.yellow(value)));
}

export function log(...message: string[]): void {
	console.log(...message);
}

/** Clear the terminal of all text. */
export function clear(): void {
	process.stdout.write(
		process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H"
	);
}

/** Log a message and exit the current process. If the `code` is non-zero then `console.error` will be used instead of `console.log`. */
export function exit(message: string | Error, code = 1): never {
	if (message instanceof Error) {
		exception(message);
		process.exit(code);
	}

	if (message) {
		if (code === 0) {
			log(message);
		} else {
			error(message);
		}
	}

	process.exit(code);
}

// The re-export makes auto importing easier.
export const Logger = {
	error,
	exception,
	warn,
	log,
	clear,
	exit,
};
