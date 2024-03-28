export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const GRAPHQL_QUERIES = {
	GET_SHORTCUTS: `query GetShortcuts($userId: String!) {
		getUserSections(user: $userId) {
			title
			position
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	SET_SHORTCUTS: `mutation SetShortcuts($userId: String!, $sectionId: ID!, $sectionTitle: String, $sectionPosition: Int, $shortcuts: [ShortcutInput]!) {
		updateUserShortcuts(user: $userId, sectionId: $sectionId, sectionTitle: $sectionTitle, sectionPosition: $sectionPosition, shortcuts: $shortcuts) {
			title
			position
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
};

/* c8 ignore start */
export const graphQLCall = async ({
	query,
	data,
	headers = {},
}: {
	data: any;
	query: any;
	headers?: any;
}) => {
	const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/graphql`, {
		method: "POST",
		headers: {
			...headers,
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({
			query,
			variables: data,
		}),
	});
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
