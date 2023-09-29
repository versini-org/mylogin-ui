import JSON5 from "json5";

export const jsonParse = (json: string) => {
	try {
		return JSON5.parse(json);
	} catch (e) {
		return undefined;
	}
};
