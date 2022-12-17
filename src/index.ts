import path from "path";
import chalk from "chalk";
import * as chokidar from "chokidar";
import loadModule from "./loadModule";
import writeFile from "./writeFile";
import getId from "./getId";

type Output = {
	key: string;
	inputValue: string;
	outputValue: string;
};

type InputObject = {
	[key: string]: string;
};

type CacheObject = {
	[key: string]: {
		_cache_input_val: string;
		_cache_output_val: string;
	};
};

type Config = {
	inputFilePath: string;
	isWatch: boolean;
	isForce: boolean;
};

class MakeIds {
	private _inputPath: string;
	private _cachePath: string;
	private _outputIndexPath: string;
	private _outputDPath: string;
	private _isWatch: boolean;
	private _isForce: boolean;

	constructor(config: Config) {
		const projectPath: string = process.cwd();
		const modulePath: string = path.resolve(__dirname, "../");

		this._inputPath = path.resolve(projectPath, config.inputFilePath);
		this._cachePath = path.resolve(
			projectPath,
			"./node_modules/.cache/elementid/__cache__ids.js"
		);
		this._outputIndexPath = path.resolve(modulePath, "./dist/index.js");
		this._outputDPath = path.resolve(modulePath, "./dist/index.d.ts");
		this._isWatch = config.isWatch;
		this._isForce = config.isForce;
	}

	async start() {
		// clear the cache file
		if (this._isForce) {
			writeFile(this._cachePath, "");
		}

		// waiting for the input changes or straightforward generate outputs
		if (this._isWatch) {
			const watcher = chokidar.watch([this._inputPath]);
			watcher.on("change", () => {
				this.run();
			});
		} else {
			this.run();
		}
	}

	private async run() {
		const inputModule = await loadModule(this._inputPath);
		const cacheModule = await loadModule(this._cachePath);

		if (inputModule) {
			// find the input module has the default export
			if (!inputModule.hasOwnProperty("default")) {
				this.showError("Can't find default export in input file");
				return;
			}

			// read cache data
			const cacheObj: CacheObject = {};
			if (cacheModule) {
				if (cacheModule.hasOwnProperty("default")) {
					Object.assign(cacheObj, cacheModule.default);
				}
			}

			// create output and cache data
			const inputObj: InputObject = inputModule.default;
			this.createOutputAndCache(inputObj, cacheObj);
		} else {
			this.showError("Can't find input file");
			return;
		}
	}

	// create the output files and the cache file
	private createOutputAndCache(input: InputObject, cache: CacheObject): void {
		const inputKeys: Array<string> = Object.keys(input);
		const cacheKeys: Array<string> = Object.keys(cache);

		// convert the cache keys to string
		const cacheKeysStr: string = cacheKeys.join(", ");

		// map the input key array
		const outputs: Array<Output> = inputKeys.map((inputKey) => {
			const hasKeyInCache = cacheKeysStr.includes(inputKey);
			const currentInputValue: string = input[inputKey]; // current input value from
			let outputValue: string = "";

			if (hasKeyInCache) {
				// if the input key available in the cache
				const cacheObj = cache[inputKey];
				const previousInput: string = cacheObj._cache_input_val;
				const previousOutput: string = cacheObj._cache_output_val;

				// compair the cache and the input values
				if (previousInput === "" && currentInputValue === "") {
					// if input and cache values are empty
					outputValue = previousOutput;
				} else if (previousInput !== "" && currentInputValue === "") {
					// if the cache has some value and the input is empty
					outputValue = getId();
				} else if (previousInput === "" && currentInputValue !== "") {
					// if the cache value is empty and input has some value
					outputValue = currentInputValue;
				} else {
					// if the input and the chache values are not empty
					outputValue = currentInputValue;
				}
			} else {
				// if the input key not available in the cache
				outputValue = currentInputValue === "" ? getId() : currentInputValue;
			}

			return {
				key: inputKey,
				inputValue: currentInputValue,
				outputValue: outputValue,
			};
		});

		this.makeOutputIndexFile(outputs);
		this.makeOutputDeclarationFile(outputs);
		this.makeCacheFile(outputs);
		this.showSuccess("Successfully generated ids");
	}

	private makeOutputIndexFile(outputs: Array<Output>): void {
		const content: string = `${outputs
			.map((item) => `export const ${item.key} = "${item.outputValue}";`)
			.join("\n")}`;
		writeFile(this._outputIndexPath, content);
	}

	private makeOutputDeclarationFile(outputs: Array<Output>): void {
		const content: string = `${outputs
			.map((item) => `export declare const ${item.key}: string;`)
			.join("\n")}`;
		writeFile(this._outputDPath, content);
	}

	private makeCacheFile(outputs: Array<Output>): void {
		const keyInputValue: string = "_cache_input_val";
		const keyOutputValue: string = "_cache_output_val";
		const sumContent: string = outputs
			.map(
				(item) =>
					`    ${item.key}: { ${keyInputValue}: "${item.inputValue}", ${keyOutputValue}: "${item.outputValue}" },`
			)
			.join("\n");
		const content: string = `module.exports = {\n${sumContent}\n};`;
		writeFile(this._cachePath, content);
	}

	private showError(message: string): void {
		console.error(chalk.red(`[Error from element-id] ${message}`));
	}

	private showSuccess(message: string): void {
		console.error(chalk.green(`[Success from element-id] ${message}`));
	}
}

export default MakeIds;
