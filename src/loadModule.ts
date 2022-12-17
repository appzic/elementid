const loadModule = async (modulePath: string) => {
	try {
		return await import(modulePath);
	} catch (e) {
		console.log("");
	}
};

export default loadModule;
