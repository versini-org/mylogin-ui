import JSON5 from "json5";

export const jsonParse = (json: string) => {
	return JSON5.parse(json);
};
