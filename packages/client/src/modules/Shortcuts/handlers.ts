import { v4 as uuidv4 } from "uuid";

import {
	ACTION_REFRESH_DATA,
	ACTION_SET_STATUS,
	ACTION_STATUS_ERROR,
	ACTION_STATUS_SUCCESS,
} from "../../common/constants";
import { FAKE_USER_EMAIL } from "../../common/strings";
import type { SectionProps } from "../../common/types";
import { editShortcuts } from "../../common/utilities";

export const onClickAddShortcut = async ({
	section,
	position,
	basicAuth,
	dispatch,
}: {
	basicAuth: string | boolean;
	dispatch: any;
	position: number | null;
	section: SectionProps | null;
}) => {
	if (section?.shortcuts && position !== null) {
		section.shortcuts.splice(position + 1, 0, {
			id: uuidv4(),
			label: "New Shortcut",
			url: "https://www.example.com",
		});
		const response = await editShortcuts({
			basicAuth,
			userId: FAKE_USER_EMAIL,
			sectionId: section.id,
			sectionTitle: section.title,
			shortcuts: section.shortcuts,
		});
		if (response.status !== 200) {
			dispatch({
				type: ACTION_SET_STATUS,
				payload: {
					status: ACTION_STATUS_ERROR,
				},
			});
		} else {
			dispatch({
				type: ACTION_REFRESH_DATA,
				payload: {
					status: ACTION_STATUS_SUCCESS,
					sections: response.data,
				},
			});
		}
	} else {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	}
};

export const onClickDeleteShortcut = async ({
	section,
	position,
	basicAuth,
	dispatch,
}: {
	basicAuth: string | boolean;
	dispatch: any;
	position: number | null;
	section: SectionProps | null;
}) => {
	if (section && position !== null) {
		section.shortcuts.splice(position, 1);
		const response = await editShortcuts({
			basicAuth,
			userId: FAKE_USER_EMAIL,
			sectionId: section.id,
			sectionTitle: section.title,
			shortcuts: section.shortcuts,
		});
		if (response.status !== 200) {
			dispatch({
				type: ACTION_SET_STATUS,
				payload: {
					status: ACTION_STATUS_ERROR,
				},
			});
		} else {
			dispatch({
				type: ACTION_REFRESH_DATA,
				payload: {
					status: ACTION_STATUS_SUCCESS,
					sections: response.data,
				},
			});
		}
	} else {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	}
};

export const onChangeShortcut = async ({
	label,
	url,
	position,
	section,
	dispatch,
	basicAuth,
}: {
	basicAuth: any;
	dispatch: any;
	position: any;
	section: any;
	label?: string;
	url?: string;
}) => {
	if (label) {
		section.shortcuts[position].label = label;
	}
	if (url) {
		section.shortcuts[position].url = url;
	}
	const response = await editShortcuts({
		basicAuth,
		userId: FAKE_USER_EMAIL,
		sectionId: section.id,
		sectionTitle: section.title,
		shortcuts: section.shortcuts,
	});
	if (response.status !== 200) {
		dispatch({
			type: ACTION_SET_STATUS,
			payload: {
				status: ACTION_STATUS_ERROR,
			},
		});
	} else {
		dispatch({
			type: ACTION_REFRESH_DATA,
			payload: {
				status: ACTION_STATUS_SUCCESS,
				sections: response.data,
			},
		});
	}
};
