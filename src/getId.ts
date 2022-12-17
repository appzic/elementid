import { customAlphabet } from "nanoid";

const getId = (): string => {
	const alphabet: string = "0123456789abcdefghijklmnopqrstuvwxyz";
	const nanoid = customAlphabet(alphabet, 8);
	return nanoid();
};

export default getId;
