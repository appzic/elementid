import fs from "fs";
import path from "path";

const writeFile = (filePath: string, content: string): void => {
	const filePathDir = path.parse(filePath).dir;

	// find dir
	if (!fs.existsSync(filePathDir)) {
		// if dir not exists create new dir
		fs.mkdirSync(filePathDir, { recursive: true });
	}

	fs.writeFile(filePath, content, (err) => {
		if (err) {
			console.error(err);
			return;
		}
	});
};

export default writeFile;
