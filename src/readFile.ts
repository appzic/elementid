import fs from "fs";
import toml from "toml";

export const readToml = (
	filePath: string
): Promise<{ [key: string]: string }> => {
	return new Promise((reslove, reject) => {
		const rawData = fs.readFileSync(filePath);
		const content: { [key: string]: string } = toml.parse(rawData.toString());

		// check input format
		Object.keys(content).forEach((key) => {
			if (typeof content[key] !== "string") {
				reject(
					"Error: input file format error. please read https://github.com/appzic/elementid#how-to-use"
				);
			}
		});

		reslove(content);
	});
};

export const readJson = (filePath: string): Promise<IdCache> => {
	return new Promise((reslove, reject) => {
		const rawData: Buffer = fs.readFileSync(filePath);
		const obj: IdCache = JSON.parse(rawData.toString());
		reslove(obj);
	});
};
