import path from "path";

export const PROJECT_PATH: string = process.cwd();
export const OUTPUT_DIR: string = path.resolve(PROJECT_PATH, "elementid");
export const CACHE_PATH: string = path.resolve(
	PROJECT_PATH,
	"./node_modules/.cache/@appzic/elementid/cache_data.json"
);

export const DEFAULT_INPUT_FILE: string = "elementid.toml";
export const DEFAULT_ID_LENGTH: number = 8;
