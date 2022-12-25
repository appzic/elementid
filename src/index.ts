import path from "path";
import chalk from "chalk";
import * as chokidar from "chokidar";
import writeFile from "./writeFile";
import getId from "./getId";
import { readToml, readJson } from "./readFile";

class MakeIds {
	private _inputPath: string;
	private _cachePath: string;
	private _outputIndexPath: string;
	private _outputDPath: string;
	private _isWatch: boolean;
	private _isForce: boolean;
	private _length: number;

	constructor(config: Config) {
		const projectPath: string = process.cwd();
		const modulePath: string = path.resolve(__dirname, "../");

		this._inputPath = path.resolve(projectPath, config.inputFilePath);
		this._cachePath = path.resolve(
			projectPath,
			"./node_modules/.cache/elementid/cache_data.json"
		);
		this._outputIndexPath = path.resolve(modulePath, "./dist/index.js");
		this._outputDPath = path.resolve(modulePath, "./dist/index.d.ts");
		this._isWatch = config.isWatch;
		this._isForce = config.isForce;
		this._length = config.length;
	}

	async start() {
		// clear the cache file
		if (this._isForce) {
			this.clearCache();
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

	private run() {
		// load input
		readToml(this._inputPath)
			.then((content) => {
				// load cache
				readJson(this._cachePath)
					.then(({ data, length }) => {
						let cacheData = data;
						// if cache length and input length not equal
						if (length !== this._length) {
							this.clearCache();
							cacheData = [];
						}
						this.createOutputAndCache(content, cacheData);
					})
					.catch(() => {
						this.createOutputAndCache(content, []);
					});
			})
			.catch((errorMessage) => {
				this.showError(errorMessage);
			});
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
		const cacheObj: IdCache = {
			data: outputs,
			length: this._length,
		};
		const content: string = JSON.stringify(cacheObj);
		writeFile(this._cachePath, content);
	}

	private clearCache(): void {
		writeFile(this._cachePath, "");
	}

	private showError(message: string): void {
		console.error(chalk.red(`[elementid] ${message}`));
	}

	private showSuccess(message: string): void {
		console.log(chalk.green(`[elementid] ${message}`));
	}
}

export default MakeIds;
