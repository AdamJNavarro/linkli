import { assert, describe, expect } from "vitest";
import { test as brotest } from "@drizzle-team/brocli";
import { open } from "../../src/schema.ts";

const help_flag = "--help";
const help_flag_short = "-h";
const version_flag = "--version";
const version_flag_short = "-v";

describe("CLI usage tests", (it) => {
	it("open cmd with help flag", async () => {
		const res = await brotest(open, `${help_flag}`);
		assert.equal(res.type, "help");
	});
	it("open cmd with short help flag", async () => {
		const res = await brotest(open, `${help_flag_short}`);
		assert.equal(res.type, "help");
	});

	it("open cmd with version flag", async () => {
		const res = await brotest(open, `${version_flag}`);
		assert.equal(res.type, "version");
	});
	it("open cmd with short version flag", async () => {
		const res = await brotest(open, `${version_flag_short}`);
		assert.equal(res.type, "version");
	});

	it("open cmd with product name provided", async () => {
		const product_name = "react";
		const res = await brotest(open, product_name);
		if (res.type !== "handler") assert.fail(res.type, "handler");

		expect(res.options).toStrictEqual({ name: product_name });
	});
});
