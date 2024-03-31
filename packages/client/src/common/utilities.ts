export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const GRAPHQL_QUERIES = {
	GET_SHORTCUTS: `query GetShortcuts($userId: String!) {
		getUserSections(user: $userId) {
			title
			id
			shortcuts {
				label
				url
			}
		}
	}`,
	SET_SHORTCUTS: `mutation SetShortcuts($userId: String!, $sectionId: ID!, $sectionTitle: String, $shortcuts: [ShortcutInput]!) {
		editShortcuts(user: $userId, sectionId: $sectionId, sectionTitle: $sectionTitle, shortcuts: $shortcuts) {
			title
			id
			shortcuts {
				label
				url
			}
		}
	}`,
	CHANGE_SECTION_POSITION: `mutation ChangeSectionPosition($userId: String!, $sectionId: ID!, $direction: String!) {
		changeSectionPosition(user: $userId, sectionId: $sectionId, direction: $direction) {
			title
			id
			shortcuts {
				label
				url
			}
		}
	}`,
	DELETE_SECTION: `mutation DeleteSection($userId: String!, $sectionId: ID!) {
		deleteSection(user: $userId, sectionId: $sectionId) {
			title
			id
			shortcuts {
				label
				url
			}
		}
	}`,
	ADD_SECTION: `mutation AddSection($userId: String!, $sectionTitle: String!, $shortcuts: [ShortcutInput]) {
		addSection(user: $userId, sectionTitle: $sectionTitle, shortcuts: $shortcuts) {
			title
			id
			shortcuts {
				label
				url
			}
		}
	}`,
	EDIT_SECTION_TITLE: `mutation EditSection($userId: String!, $sectionId: ID!, $sectionTitle: String!) {
		editSectionTitle(user: $userId, sectionId: $sectionId, sectionTitle: $sectionTitle) {
			title
			id
			shortcuts {
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

export const getShortcuts = async ({
	userId,
	basicAuth,
}: {
	basicAuth: string | boolean;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.GET_SHORTCUTS,
			data: { userId },
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.getUserSections };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const addSection = async ({
	userId,
	basicAuth,
}: {
	basicAuth: string | boolean;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.ADD_SECTION,
			data: {
				userId,
				sectionTitle: "New Section",
				shortcuts: [
					{
						label: "New Shortcut",
						url: "https://example.com",
					},
				],
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.addSection };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const editSectionTitle = async ({
	userId,
	basicAuth,
	sectionId,
	sectionTitle,
}: {
	basicAuth: string | boolean;
	sectionId: string;
	sectionTitle: string;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.EDIT_SECTION_TITLE,
			data: {
				userId,
				sectionId,
				sectionTitle,
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.editSectionTitle };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const deleteSection = async ({
	userId,
	basicAuth,
	sectionId,
}: {
	basicAuth: string | boolean;
	userId: string;
	sectionId?: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.DELETE_SECTION,
			data: {
				userId,
				sectionId,
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.deleteSection };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const changeSectionPosition = async ({
	userId,
	basicAuth,
	sectionId,
	direction,
}: {
	basicAuth: string | boolean;
	direction: string;
	sectionId: string;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.CHANGE_SECTION_POSITION,
			data: {
				userId,
				sectionId,
				direction,
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.changeSectionPosition };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const addShortcuts = async ({
	userId,
	basicAuth,
	sectionId,
	sectionTitle,
	shortcuts,
}: {
	basicAuth: string | boolean;
	sectionId: string;
	sectionTitle: string;
	shortcuts: any;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.SET_SHORTCUTS,
			data: {
				userId,
				sectionId,
				sectionTitle,
				shortcuts,
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.editShortcuts };
	} catch (error) {
		return { status: 500, data: [] };
	}
};

export const editShortcuts = async ({
	userId,
	basicAuth,
	sectionId,
	sectionTitle,
	shortcuts,
}: {
	basicAuth: string | boolean;
	sectionId: string;
	sectionTitle: string;
	shortcuts: any;
	userId: string;
}) => {
	try {
		const authorization = `Basic ${basicAuth}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: GRAPHQL_QUERIES.SET_SHORTCUTS,
			data: {
				userId,
				sectionId,
				sectionTitle,
				shortcuts,
			},
		});
		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data } = await response.json();
		return { status: response.status, data: data.editShortcuts };
	} catch (error) {
		return { status: 500, data: [] };
	}
};
