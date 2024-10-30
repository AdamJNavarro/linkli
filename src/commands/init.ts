/**
 * @file Contains the logic used in the init command.
 */

import { Logger } from "../utils/output/logger.ts";
import {
	add_to_git_ignore_async,
	check_for_git_dir_async,
	maybe_exit_on_git_status_async,
} from "../utils/git/index.ts";
import { find_project_root_or_assert } from "../utils/filesys/project-root.ts";
import { CLI_NAME } from "../constants.ts";

export async function init_project_async(): Promise<void> {
	const project_root = find_project_root_or_assert(process.cwd());

	const git_exists = await check_for_git_dir_async(project_root);

	if (!git_exists) {
		Logger.exit("Git could not be found for this project.", 0);
	}

	const should_exit = await maybe_exit_on_git_status_async();

	if (should_exit) {
		Logger.exit("Quitting initialization.", 0);
	}

	Logger.log("Checking gitignore...");

	const gitignore_was_updated = await add_to_git_ignore_async(project_root);

	if (gitignore_was_updated) {
		Logger.log(`Added ${CLI_NAME} patterns to gitignore.`);
	}
}
