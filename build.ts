import path from "path";
import writeFile from "./src/writeFile";

const distIndexPath = path.resolve(__dirname, "./dist/index.js");
const distDPath = path.resolve(__dirname, "./dist/index.d.ts");
writeFile(distIndexPath, "");
writeFile(distDPath, "");
