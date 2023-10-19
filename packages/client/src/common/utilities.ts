export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const truncate = (fullString: string, maxLength: number) => {
	const ELLIPSIS = "...";
	const ELLIPSIS_LENGTH = ELLIPSIS.length;
	const truncatedString =
		maxLength > ELLIPSIS_LENGTH && fullString.length > maxLength
			? fullString.substring(0, maxLength - ELLIPSIS_LENGTH) + ELLIPSIS
			: fullString;

	return {
		truncatedString,
		fullString,
	};
};

/* c8 ignore start */
export const serviceCall = async ({
	name,
	data,
	method = "POST",
	headers = {},
}: {
	name: string;
	data: any;
	method?: string;
	headers?: any;
}) => {
	const response = await fetch(
		`${import.meta.env.VITE_SERVER_URL}/api/${name}`,
		{
			method,
			headers: {
				...headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		},
	);
	return response;
};
/* c8 ignore stop */

/* c8 ignore start */
export const getViewportWidth = () => {
	return Math.max(
		document.documentElement.clientWidth || 0,
		window.innerWidth || 0,
	);
};
/* c8 ignore stop */

export const obfuscate = (str: string) => {
	/**
	 * First we use encodeURIComponent to get percent-encoded
	 * UTF-8, then we convert the percent encodings into raw
	 * bytes which can be fed into btoa.
	 */
	return window.btoa(
		encodeURIComponent(str).replace(
			/%([0-9A-F]{2})/g,
			function toSolidBytes(_match, p1) {
				return String.fromCharCode(Number(`0x${p1}`));
			},
		),
	);
};

export const unObfuscate = (str: string) => {
	/**
	 * Going backwards: from bytestream, to percent-encoding,
	 * to original string.
	 */
	return decodeURIComponent(
		window
			.atob(str)
			.split("")
			.map(function (c) {
				return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`;
			})
			.join(""),
	);
};
