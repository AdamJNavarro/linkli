import os from "node:os";
import { join } from "node:path";
import confirm from "@inquirer/confirm";
import fs from "node:fs";
import { CLI_DIR } from "../../constants.js";
import { spawn_async } from "../exec/spawn.js";
import chalk from "chalk";
import { Logger } from "../output/logger.js";

/**
 * Check to see if project has a .git dir
 *
 * @export
 * @async
 * @param {string} project_root
 * @returns {Promise<boolean>}
 */
export async function check_for_git_dir_async(
	project_root: string
): Promise<boolean> {
	try {
		await spawn_async("git", ["rev-parse", "--git-dir"], {
			cwd: project_root,
		});
		return true;
	} catch (error) {
		return false;
	}
}

/**
 * Check if git status is clean or dirty.
 *
 * @export
 * @async
 * @returns {Promise<boolean>}
 */
export async function validate_git_status_async(): Promise<boolean> {
	let working_status = "unknown";
	try {
		const result = await spawn_async("git", ["status", "--porcelain"]);
		working_status = result.stdout === "" ? "clean" : "dirty";
	} catch {}

	if (working_status === "clean") {
		return true;
	}

	Logger.warn(`${chalk.bold`! `}Git branch has uncommited file changes`);
	Logger.log(
		chalk.gray`\u203A ` +
			chalk.gray(
				`It's recommended to commit all changes before proceeding in case you want to revert generated changes.`
			)
	);

	return false;
}

/**
 * Prompts user to continue or exit if git status is dirty.
 *
 * @export
 * @async
 * @returns {Promise<boolean>}
 */
export async function maybe_exit_on_git_status_async(): Promise<boolean> {
	const is_git_status_clean = await validate_git_status_async();

	if (!is_git_status_clean) {
		const answer = await confirm({
			message: "Continue despite having uncommited changes?",
		});
		if (!answer) {
			return true;
		}
	}

	return false;
}

/**
 * Adds desired Linkli paths to project's .gitignore file.
 *
 * @export
 * @async
 * @param {string} path
 * @param {*} [ignore=CLI_DIR]
 * @returns {Promise<boolean>}
 */
export async function add_to_git_ignore_async(
	path: string,
	ignore = CLI_DIR
): Promise<boolean> {
	let is_git_ignore_updated = false;
	try {
		const git_ignore_path = join(path, ".gitignore");

		let git_ignore =
			(await fs.promises.readFile(git_ignore_path, "utf8").catch(() => null)) ??
			"";
		const EOL = git_ignore.includes("\r\n") ? "\r\n" : os.EOL;
		let content_modified = false;

		if (!git_ignore.split(EOL).includes(ignore)) {
			git_ignore += `${
				git_ignore.endsWith(EOL) || git_ignore.length === 0 ? "" : EOL
			}${ignore}${EOL}`;
			content_modified = true;
		}

		if (content_modified) {
			await fs.promises.writeFile(git_ignore_path, git_ignore);
			is_git_ignore_updated = true;
		}
	} catch (error) {
		// ignore errors since this is non-critical
	}
	return is_git_ignore_updated;
}
