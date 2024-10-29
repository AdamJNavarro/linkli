import test from "ava";
import { execa } from "execa";
import { getBinPath } from "get-bin-path";

test("basic exec with help flag", async (t) => {
	const bin_path = await getBinPath();
	const { stdout } = await execa(bin_path, ["--help"]);
	t.true(stdout.length > 0);
});
