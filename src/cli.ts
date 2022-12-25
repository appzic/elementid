#!/usr/bin/env node

import * as yargs from "yargs";
import MakeIds from "./index";
import { number } from "yargs";

const lengthItems: Array<number> = [5, 6, 7, 8, 9, 10];

const yarg = yargs
	.usage(
		"Create unique, non-conflict and shareable ids based on input file .\nUsage: $0 <input file> [options]"
	)
	.example("$0 ids.js", "with the input file")
	.example("$0 ids.js --length=7", "with the input file and length option")
	.example("$0 src/my_ids.js --watch", "with the input file and watch option")
	.alias("w", "watch")
	.describe("w", "Watch changes of input file")
	.boolean("w")
	.alias("f", "force")
	.describe("f", "Generate unique ids without cacheing")
	.boolean("f")
	.alias("l", "length")
	.describe(
		"l",
		`Length of the unique id values\n(default = 8, options = ${lengthItems.join(
			", "
		)})`
	)
	.number("l")
	.alias("h", "help")
	.version(require("../package.json").version);

main();

async function main(): Promise<void> {
	const argv = yarg.argv;

	// get input file path
	let inputFilePath: string;
	if (argv._ && argv._[0]) {
		inputFilePath = argv._[0] as string;
	} else {
		yarg.showHelp();
		return;
	}

	// check length
	const length = argv.l;
	if (typeof length === "number") {
		if (!lengthItems.join("|").includes(length.toString())) {
			console.log(`length should be ${lengthItems.join(" | ")}`);
			return;
		}
	}

	const makeIds = new MakeIds({
		inputFilePath,
		isWatch: argv.w !== undefined,
		isForce: argv.f !== undefined,
		length: length === undefined ? 8 : length,
	});
	await makeIds.start();
}
