import { customAlphabet } from "nanoid";

const getId = (length: number): string => {
	const alphabet: string = "0123456789abcdefghijklmnopqrstuvwxyz";
	const nanoid = customAlphabet(alphabet, length);
	return nanoid();
};

export default getId;
