import JSON5 from "json5";
import { v4 as uuidv4 } from "uuid";

import type { ShortcutDataProps } from "./types";

export const jsonParse = (json: string) => {
	return JSON5.parse(json);
};

export const addUniqueId = (data: ShortcutDataProps[]) => {
	return data.map((item) => {
		item["id"] = uuidv4();
		return item;
	});
};
