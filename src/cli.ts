#!/usr/bin/env node

import * as yargs from "yargs";
import MakeIds from "./index";

const yarg = yargs
	.usage(
		"Create unique, non-conflict and shareable ids based on input file .\nUsage: $0 <input file> [options]"
	)
	.example("$0 ids.js", "with the input file")
	.example("$0 src/my_ids.js --watch", "with the input file and a option")
	.describe("init", "Generate empty input file")
	.boolean("init")
	.alias("w", "watch")
	.describe("w", "Watch changes of input file")
	.boolean("w")
	.alias("f", "force")
	.describe("f", "Generate unique ids without cacheing")
	.boolean("f")
	.alias("h", "help")
	.version(require("../package.json").version);

main();

async function main(): Promise<void> {
	const argv = yarg.argv;

	if (argv.init) {
		console.log("generate empty input file");
		return;
	}

	// get input file path
	let inputFilePath: string;
	if (argv._ && argv._[0]) {
		inputFilePath = argv._[0] as string;
	} else {
		yarg.showHelp();
		return;
	}

	const makeIds = new MakeIds({
		inputFilePath,
		isWatch: argv.w !== undefined,
		isForce: argv.f !== undefined,
	});
	await makeIds.start();
}
