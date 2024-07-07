import { v4 as uuidv4 } from "uuid";

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const DOMAIN = isDev ? "gizmette.local.com" : "mylogin.gizmette.com";

const GRAPHQL_QUERIES = {
	GET_SHORTCUTS: `query GetShortcuts {
		getUserSections {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	SET_SHORTCUTS: `mutation SetShortcuts($sectionId: ID!, $sectionTitle: String, $shortcuts: [ShortcutInput]!) {
		editShortcuts(sectionId: $sectionId, sectionTitle: $sectionTitle, shortcuts: $shortcuts) {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	CHANGE_SECTION_POSITION: `mutation ChangeSectionPosition($sectionId: ID!, $direction: String!) {
		changeSectionPosition(sectionId: $sectionId, direction: $direction) {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	DELETE_SECTION: `mutation DeleteSection($sectionId: ID!) {
		deleteSection(sectionId: $sectionId) {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	ADD_SECTION: `mutation AddSection($sectionTitle: String!, $sectionPosition: Int, $shortcuts: [ShortcutInput]) {
		addSection(sectionTitle: $sectionTitle, sectionPosition: $sectionPosition, shortcuts: $shortcuts) {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
	EDIT_SECTION_TITLE: `mutation EditSection($sectionId: ID!, $sectionTitle: String!) {
		editSectionTitle(sectionId: $sectionId, sectionTitle: $sectionTitle) {
			title
			id
			shortcuts {
				id
				label
				url
			}
		}
	}`,
};

export const SERVICE_TYPES = {
	GET_SHORTCUTS: {
		schema: GRAPHQL_QUERIES.GET_SHORTCUTS,
		method: "getUserSections",
	},
	ADD_SECTION: {
		schema: GRAPHQL_QUERIES.ADD_SECTION,
		method: "addSection",
		data: ({ position }: { position: number }) => ({
			sectionTitle: "New Section",
			sectionPosition: position,
			shortcuts: [
				{
					id: uuidv4(),
					label: "New Shortcut",
					url: "https://example.com",
				},
			],
		}),
	},
	EDIT_SECTION_TITLE: {
		schema: GRAPHQL_QUERIES.EDIT_SECTION_TITLE,
		method: "editSectionTitle",
	},
	DELETE_SECTION: {
		schema: GRAPHQL_QUERIES.DELETE_SECTION,
		method: "deleteSection",
	},
	CHANGE_SECTION_POSITION: {
		schema: GRAPHQL_QUERIES.CHANGE_SECTION_POSITION,
		method: "changeSectionPosition",
	},
	EDIT_SHORTCUTS: {
		schema: GRAPHQL_QUERIES.SET_SHORTCUTS,
		method: "editShortcuts",
	},
};

/* c8 ignore start */
const graphQLCall = async ({
	query,
	data,
	headers = {},
}: {
	data: any;
	query: any;
	headers?: any;
}) => {
	const response = await fetch(`${process.env.PUBLIC_API_SERVER_URL}/graphql`, {
		method: "POST",
		credentials: "include",
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

export const serviceCall = async ({
	accessToken,
	type,
	params = {},
}: { accessToken: string; type: any; params?: any }) => {
	const requestData = type?.data ? type.data(params) : params;
	try {
		const authorization = `Bearer ${accessToken}`;
		const response = await graphQLCall({
			headers: {
				authorization,
			},
			query: type.schema,
			data: requestData,
		});

		if (response.status !== 200) {
			return { status: response.status, data: [] };
		}
		const { data, errors } = await response.json();
		return {
			status: response.status,
			data: data[type.method],
			errors,
		};
	} catch (_error) {
		console.error(_error);
		return { status: 500, data: [] };
	}
};
