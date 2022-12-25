type Output = {
	key: string;
	inputValue: string;
	outputValue: string;
};

type CacheData = Output;

type IdCache = {
	data: Array<CacheData>;
	length: number;
};

type InputObject = {
	[key: string]: string;
};

type Config = {
	inputFilePath: string;
	isWatch: boolean;
	isForce: boolean;
	length: number;
};
