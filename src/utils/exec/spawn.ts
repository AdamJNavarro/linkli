import type {
	ChildProcess,
	SpawnOptions as NodeSpawnOptions,
} from "node:child_process";
import spawn from "cross-spawn";

export interface CustomSpawnOptions extends NodeSpawnOptions {
	ignoreStdio?: boolean;
}

export interface CustomSpawnPromise<T> extends Promise<T> {
	child: ChildProcess;
}

export interface CustomSpawnResult {
	pid?: number;
	output: string[];
	stdout: string;
	stderr: string;
	status: number | null;
	signal: string | null;
}

export function spawn_async(
	command: string,
	args?: ReadonlyArray<string>,
	options: CustomSpawnOptions = {}
): CustomSpawnPromise<CustomSpawnResult> {
	const stubError = new Error();
	const callerStack = stubError.stack
		? stubError.stack.replace(/^.*/, "    ...")
		: null;

	let child: ChildProcess;
	const promise = new Promise((resolve, reject) => {
		const { ignoreStdio, ...nodeOptions } = options;
		// @ts-ignore: cross-spawn declares "args" to be a regular array instead of a read-only one
		child = spawn(command, args, nodeOptions);
		let stdout = "";
		let stderr = "";

		if (!ignoreStdio) {
			if (child.stdout) {
				child.stdout.on("data", (data) => {
					stdout += data;
				});
			}

			if (child.stderr) {
				child.stderr.on("data", (data) => {
					stderr += data;
				});
			}
		}

		const completionListener = (code: number | null, signal: string | null) => {
			child.removeListener("error", errorListener);
			const result: CustomSpawnResult = {
				pid: child.pid,
				output: [stdout, stderr],
				stdout,
				stderr,
				status: code,
				signal,
			};
			if (code !== 0) {
				const argumentString =
					args && args.length > 0 ? ` ${args.join(" ")}` : "";
				const error = signal
					? new Error(
							`${command}${argumentString} exited with signal: ${signal}`
						)
					: new Error(
							`${command}${argumentString} exited with non-zero code: ${code}`
						);
				if (error.stack && callerStack) {
					error.stack += `\n${callerStack}`;
				}
				Object.assign(error, result);
				reject(error);
			} else {
				resolve(result);
			}
		};

		const errorListener = (error: Error) => {
			if (ignoreStdio) {
				child.removeListener("exit", completionListener);
			} else {
				child.removeListener("close", completionListener);
			}
			Object.assign(error, {
				pid: child.pid,
				output: [stdout, stderr],
				stdout,
				stderr,
				status: null,
				signal: null,
			});
			reject(error);
		};

		if (ignoreStdio) {
			child.once("exit", completionListener);
		} else {
			child.once("close", completionListener);
		}
		child.once("error", errorListener);
	}) as CustomSpawnPromise<CustomSpawnResult>;
	// @ts-ignore: TypeScript isn't aware the Promise constructor argument runs synchronously and
	// thinks `child` is not yet defined
	promise.child = child;
	return promise;
}
