import * as C from "./constents";
import path from "path";
import {
	ensureDirSync,
	ensureFileSync,
	readFileSync,
	readJSONSync,
	writeFileSync,
} from "fs-extra";
import chalk from "chalk";
import * as chokidar from "chokidar";
import getId from "./getId";
import toml from "toml";

class MakeIds {
	private _inputPath: string;
	private _cachePath: string;
	private _outputDir: string;
	private _isWatch: boolean;
	private _isForce: boolean;
	private _length: number;

	constructor(config: Config) {
		const me = this;
		this._inputPath = path.resolve(C.PROJECT_PATH, config.inputFilePath);
		this._cachePath = C.CACHE_PATH;
		this._outputDir = C.OUTPUT_DIR;
		this._isWatch = config.isWatch;
		this._isForce = config.isForce;
		this._length = config.length;

		// ensuare dir and files
		ensureDirSync(me._outputDir);
		ensureFileSync(me._cachePath);
		ensureFileSync(me._inputPath);
	}

	async start() {
		const me = this;
		// clear the cache file
		if (me._isForce) {
			me.clearCache();
		}

		// waiting for the input changes or straightforward generate outputs
		if (me._isWatch) {
			const watcher = chokidar.watch([me._inputPath]);
			watcher.on("change", () => {
				me.run();
			});
		} else {
			me.run();
		}
	}

	private run() {
		const me = this;
		const inputDataStr = readFileSync(me._inputPath, { encoding: "utf-8" });
		const inputData = toml.parse(inputDataStr);
		const cacheDataStr = readFileSync(me._cachePath, { encoding: "utf-8" });

		if (cacheDataStr === "") {
			this.createOutputAndCache(inputData, []);
		} else {
			const { data, length } = JSON.parse(cacheDataStr);
			let cacheData = data;
			// if cache length and input length not equal
			if (length !== this._length) {
				me.clearCache();
				cacheData = [];
			}
			me.createOutputAndCache(inputData, cacheData);
		}
	}

	// create the output files and the cache file
	private createOutputAndCache(
		input: InputObject,
		cache: Array<CacheData>
	): void {
		const inputKeys: Array<string> = Object.keys(input);
		const cacheKeys: Array<string> = cache.map((obj) => obj.key);

		// convert the cache keys to string
		const cacheKeysStr: string = cacheKeys.join(", ");

		// map the input key array
		const outputs: Array<Output> = inputKeys.map((inputKey) => {
			const hasKeyInCache = cacheKeysStr.includes(inputKey);
			const currentInputValue: string = input[inputKey]; // current input value from
			let outputValue: string = "";

			if (hasKeyInCache) {
				// if the input key available in the cache
				const cacheObj = cache.find((obj) => inputKey === obj.key);
				if (cacheObj !== undefined) {
					const previousInput: string = cacheObj.inputValue;
					const previousOutput: string = cacheObj.outputValue;

					// compair the cache and the input values
					if (previousInput === "" && currentInputValue === "") {
						// if input and cache values are empty
						outputValue = previousOutput;
					} else if (previousInput !== "" && currentInputValue === "") {
						// if the cache has some value and the input is empty
						outputValue = getId(this._length);
					} else if (previousInput === "" && currentInputValue !== "") {
						// if the cache value is empty and input has some value
						outputValue = currentInputValue;
					} else {
						// if the input and the chache values are not empty
						outputValue = currentInputValue;
					}
				}
			} else {
				// if the input key not available in the cache
				outputValue =
					currentInputValue === "" ? getId(this._length) : currentInputValue;
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
		this.showSuccess("successfully updated ids");
	}

	private makeOutputIndexFile(outputs: Array<Output>): void {
		const filePath = path.resolve(this._outputDir, "./index.js");
		const content: string = `${outputs
			.map((item) => `export const ${item.key} = "${item.outputValue}";`)
			.join("\n")}`;
		writeFileSync(filePath, content);
	}

	private makeOutputDeclarationFile(outputs: Array<Output>): void {
		const filePath = path.resolve(this._outputDir, "./index.d.ts");
		const content: string = `${outputs
			.map((item) => `export declare const ${item.key}: string;`)
			.join("\n")}`;
		writeFileSync(filePath, content);
	}

	private makeCacheFile(outputs: Array<Output>): void {
		const cacheObj: IdCache = {
			data: outputs,
			length: this._length,
		};
		const content: string = JSON.stringify(cacheObj);
		writeFileSync(this._cachePath, content);
	}

	private clearCache(): void {
		writeFileSync(this._cachePath, "");
	}

	private showError(message: string): void {
		console.error(chalk.red(`[elementid] ${message}`));
	}

	private showSuccess(message: string): void {
		console.log(chalk.green(`[elementid] ${message}`));
	}
}

export default MakeIds;
