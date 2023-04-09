#!/usr/bin/env node

import * as yargs from "yargs";
import * as C from "./constents";
import MakeIds from "./run";

const lengthItems: Array<number> = [5, 6, 7, 8, 9, 10];

const yarg = yargs
	.usage(
		"Create unique, non-conflict and shareable ids based on input file .\nUsage: $0 [options]"
	)
	.example("$0", "Build element ids")
	.example("$0 --length=7", "Build element ids with length option")
	.example("$0 --watch", "Build element ids in development mode")
	.string("i")
	.alias("i", "input")
	.describe("i", `Input file path\n(default = ${C.DEFAULT_INPUT_FILE})`)
	.boolean("w")
	.alias("w", "watch")
	.describe("w", "Watch changes of input file")
	.alias("f", "force")
	.describe("f", "Generate unique ids without cacheing")
	.boolean("f")
	.alias("l", "length")
	.describe(
		"l",
		`Length of the unique id values\n(default = ${
			C.DEFAULT_ID_LENGTH
		}, options = ${lengthItems.join(", ")})`
	)
	.number("l")
	.alias("h", "help")
	.version(require("../package.json").version);

main();

async function main(): Promise<void> {
	const argv = yarg.argv;

	// check length
	const length = argv.l;
	if (typeof length === "number") {
		if (!lengthItems.join("|").includes(length.toString())) {
			console.log(`length should be ${lengthItems.join(" | ")}`);
			return;
		}
	}

	const config: Config = {
		inputFilePath: typeof argv.i === "string" ? argv.i : C.DEFAULT_INPUT_FILE,
		isWatch: argv.w !== undefined,
		isForce: argv.f !== undefined,
		length: typeof argv.l === "number" ? argv.l : C.DEFAULT_ID_LENGTH,
	};

	const makeIds = new MakeIds(config);
	makeIds.start();
}
