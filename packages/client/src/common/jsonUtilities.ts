import JSON5 from "json5";
import { v4 as uuidv4 } from "uuid";

import type { ShortcutDataProps } from "./types";

/**
 * Function to wrap a string in double quotes if it is not already wrapped,
 * and to replace the wrapping single quotes if they are present with double.
 */
export const wrapStringInDoubleQuotes = (str: string): string => {
	// Add a starting " if the first character is not " or '
	if (str.charAt(0) !== '"' && str.charAt(0) !== "'") {
		str = '"' + str;
	}
	// If needed, replace the first character from ' to "
	if (str.charAt(0) === "'") {
		str = '"' + str.slice(1);
	}
	// Add an ending " if if the last character is not " or '
	if (
		str.charAt(str.length - 1) !== '"' &&
		str.charAt(str.length - 1) !== "'"
	) {
		str = str + '"';
	}
	// If needed, replace the last character from ' to "
	if (str.charAt(str.length - 1) === "'") {
		str = str.slice(0, -1) + '"';
	}

	return str;
};

export const jsonParse = (json: string, autofix = false): any => {
	if (autofix) {
		json = wrapStringInDoubleQuotes(json);
	}

	try {
		return JSON5.parse(json);
	} catch (error) {
		throw new Error("Invalid JSON format");
	}
};

export const addUniqueId = (data: ShortcutDataProps[]): ShortcutDataProps[] => {
	return data.map((item) => {
		return {
			...item,
			id: uuidv4(),
		};
	});
};
